#!/usr/bin/env bun
/**
 * Pre-commit сканер секретов для публичного репозитория ProfitableWeb.
 *
 * Роль: последний барьер перед попаданием реального секрета в git-историю
 * (репо публичный — секрет в истории компрометируется навсегда).
 * Запускается через lint-staged на список staged-файлов, переданных аргументами.
 * Exit 1 → коммит блокируется. Ложное срабатывание снимается маркером
 * `secret-scan:allow` в конце строки.
 *
 * Без внешних зависимостей: только стандартные API (fs, path), runtime — bun/node.
 */
import { readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';

const ALLOW_MARKER = 'secret-scan:allow';

// Плейсхолдеры, env- и кодовые ссылки — НЕ секреты. Строка с любым из этих признаков пропускается.
const PLACEHOLDER =
  /\$\{|<[a-zа-я_ ]+>|secrets\.|process\.env|import\.meta\.env|os\.environ|getenv|settings\.|config\.|example|placeholder|changeme|change-me|your-|dummy|redacted|скрыт|ротир|сгенерир|xxxx|\.\.\./i;

// Высокосигнальные сигнатуры реальных секретов (формат уникален — флажим всегда).
const SIGNATURES = [
  { name: 'Приватный ключ (PEM/OpenSSH)', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { name: 'AWS Access Key ID', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'GitHub token', re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{22,}/ },
  { name: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: 'Telegram bot token', re: /\b\d{8,10}:AA[A-Za-z0-9_-]{33}\b/ },
  { name: 'OpenAI/Stripe-подобный ключ', re: /\b(?:sk|rk)_[A-Za-z0-9]{20,}/ },
  { name: 'MCP-ключ проекта', re: /\bpw_mcp_[A-Za-z0-9]{16,}/ },
  { name: 'Z.AI/Zhipu API-ключ', re: /\b[0-9a-f]{32}\.[A-Za-z0-9]{16}\b/ },
  { name: 'Google OAuth access token', re: /\bya29\.[A-Za-z0-9_-]{20,}/ },
];

// Обобщённое присваивание секрета реальным значением (не плейсхолдером).
// Ключевое слово может иметь префикс через "_" (POSTGRES_PASSWORD, JWT_SECRET, S3_SECRET_KEY).
const ASSIGNMENT =
  /\b[A-Z0-9]*[_]?(?:SECRET[_-]?KEY|PRIVATE[_-]?KEY|AUTH[_-]?TOKEN|CLIENT[_-]?SECRET|API[_-]?KEY|ACCESS[_-]?KEY|SECRET|TOKEN|PASSWORD|PASSWD)\b\s*[:=]\s*['"]?([^\s'"`${}<>]{12,})/i;

// Реальный .env-файл (не пример) в staged — запрещён целиком.
const isForbiddenEnv = (path) => {
  const b = basename(path);
  return /^\.env(\.|$)/.test(b) && !/\.example$/.test(b) && !/\.sample$/.test(b);
};

const SELF = basename(new URL(import.meta.url).pathname);

const mask = (s) => (s.length <= 8 ? '***' : `${s.slice(0, 4)}***${s.slice(-2)}`);

const files = process.argv.slice(2);
const hits = [];

for (const file of files) {
  const b = basename(file);
  if (b === SELF) continue; // не сканируем сам сканер (содержит сигнатуры)

  if (isForbiddenEnv(file)) {
    hits.push({ file, line: 0, name: 'Реальный .env-файл в коммите', snippet: b });
    continue;
  }

  let content;
  try {
    if (statSync(file).size > 5_000_000) continue; // пропускаем очень большие бинарники/дампы
    content = readFileSync(file, 'utf8');
  } catch {
    continue; // удалённый/бинарный/нечитаемый файл
  }
  if (content.includes('\0')) continue; // бинарь

  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(ALLOW_MARKER)) continue;

    for (const sig of SIGNATURES) {
      const m = line.match(sig.re);
      if (m) hits.push({ file, line: i + 1, name: sig.name, snippet: mask(m[0]) });
    }

    if (!PLACEHOLDER.test(line)) {
      const m = line.match(ASSIGNMENT);
      if (m) hits.push({ file, line: i + 1, name: 'Присваивание секрета реальным значением', snippet: mask(m[1]) });
    }
  }
}

if (hits.length === 0) process.exit(0);

console.error('\n\x1b[31m✖ Обнаружены возможные секреты — коммит заблокирован:\x1b[0m\n');
for (const h of hits) {
  const loc = h.line ? `${h.file}:${h.line}` : h.file;
  console.error(`  \x1b[33m${h.name}\x1b[0m — ${loc}  [${h.snippet}]`);
}
console.error(
  '\nЧто делать:\n' +
    '  • реальный секрет → убери из файла, положи в GitHub/GitVerse Secrets, в коде оставь ${VAR}/<плейсхолдер>;\n' +
    `  • ложное срабатывание → добавь маркер "${ALLOW_MARKER}" в конце строки;\n` +
    '  • если секрет уже утёк в историю → сначала ротация, затем чистка (см. .cursor/rules/security-secrets.mdc, PW-071).\n'
);
process.exit(1);
