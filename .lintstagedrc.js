module.exports = {
  'apps/web/**/*.{ts,tsx}': (filenames) => {
    const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ');
    return [
      `bun --cwd apps/web run lint:fix ${files}`,
      `prettier --write ${files}`,
      `bun --cwd apps/web run type-check`,
    ];
  },
  'apps/admin/**/*.{ts,tsx}': (filenames) => {
    const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ');
    return [`prettier --write ${files}`];
  },
  // Проверка типов при изменении конфигурационных файлов, которые могут повлиять на типы
  'apps/web/package.json': () => {
    return `bun --cwd apps/web run type-check`;
  },
  'apps/web/tsconfig.json': () => {
    return `bun --cwd apps/web run type-check`;
  },
  'packages/**/package.json': () => {
    return `bun --cwd apps/web run type-check`;
  },
  'apps/**/*.{json,md}': (filenames) => {
    const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ');
    return `prettier --write ${files}`;
  },
  'packages/**/*.{ts,tsx,json,md}': (filenames) => {
    const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ');
    return `prettier --write ${files}`;
  },
  '*.{json,md}': (filenames) => {
    const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ');
    return `prettier --write ${files}`;
  },
};
