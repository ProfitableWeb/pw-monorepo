/**
 * PW-042-D1 | Mock-данные для раздела «Мониторинг».
 * Временный файл — удаляется в D8 при подключении реального API.
 */

import type {
  SystemHealth,
  ErrorLogEntry,
  ErrorStats,
  AuditLogEntry,
} from './monitoring.types';

// ---------------------------------------------------------------------------
// User-Agent строки для моков
// ---------------------------------------------------------------------------

/** Админ — Chrome на Windows */
const UA_ADMIN =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
/** Анна — Safari на iPhone */
const UA_ANNA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
/** Подозрительный — скрипт / бот */
const UA_BOT = 'python-requests/2.31.0';
/** Анонимный — Firefox на Linux */
const UA_FIREFOX =
  'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0';
/** curl */
const UA_CURL = 'curl/8.5.0';

// ---------------------------------------------------------------------------
// Генераторы дополнительных записей (объявлены до массивов из-за TDZ)
// ---------------------------------------------------------------------------

const USERS = [
  {
    id: 'usr-admin-001',
    name: 'Николай',
    email: 'admin@profitableweb.ru',
    ip: '192.168.1.10',
    ua: UA_ADMIN,
  },
  {
    id: 'usr-viewer-003',
    name: 'Анна Петрова',
    email: 'anna@example.com',
    ip: '10.0.0.55',
    ua: UA_ANNA,
  },
  { id: null, name: null, email: null, ip: '203.0.113.42', ua: UA_BOT },
  { id: null, name: null, email: null, ip: '89.123.45.67', ua: UA_FIREFOX },
] as const;

const ERROR_TEMPLATES: Pick<
  ErrorLogEntry,
  'level' | 'event' | 'message' | 'requestMethod' | 'requestPath' | 'statusCode'
>[] = [
  {
    level: 'error',
    event: 'unhandled_exception',
    message: 'AttributeError: NoneType object',
    requestMethod: 'GET',
    requestPath: '/api/articles',
    statusCode: 500,
  },
  {
    level: 'warning',
    event: 'slow_query',
    message: 'Query took 1850ms',
    requestMethod: 'GET',
    requestPath: '/api/admin/articles',
    statusCode: 200,
  },
  {
    level: 'error',
    event: 'validation_error',
    message: 'RequestValidationError: invalid field',
    requestMethod: 'POST',
    requestPath: '/api/admin/articles',
    statusCode: 422,
  },
  {
    level: 'warning',
    event: 'rate_limit_exceeded',
    message: 'Too many requests',
    requestMethod: 'GET',
    requestPath: '/api/articles',
    statusCode: 429,
  },
  {
    level: 'error',
    event: 's3_upload_failed',
    message: 'ClientError: ServiceUnavailable',
    requestMethod: 'POST',
    requestPath: '/api/admin/media/upload',
    statusCode: 503,
  },
  {
    level: 'error',
    event: 'media_processing_failed',
    message: 'ImageProcessingError: corrupt EXIF',
    requestMethod: 'POST',
    requestPath: '/api/admin/media/upload',
    statusCode: 500,
  },
  {
    level: 'warning',
    event: 'oauth_token_refresh_failed',
    message: 'Google OAuth: refresh token revoked',
    requestMethod: 'POST',
    requestPath: '/api/auth/refresh',
    statusCode: 401,
  },
  {
    level: 'error',
    event: 'unhandled_exception',
    message: 'JSONDecodeError: Expecting value',
    requestMethod: 'POST',
    requestPath: '/api/admin/settings',
    statusCode: 500,
  },
];

const AUDIT_TEMPLATES: Pick<
  AuditLogEntry,
  'action' | 'resourceType' | 'changes'
>[] = [
  {
    action: 'article.updated',
    resourceType: 'article',
    changes: { title: { old: 'Черновик', new: 'Обновлённый заголовок' } },
  },
  { action: 'article.created', resourceType: 'article', changes: null },
  { action: 'media.uploaded', resourceType: 'media_file', changes: null },
  { action: 'auth.login', resourceType: 'user', changes: null },
  { action: 'auth.logout', resourceType: 'user', changes: null },
  { action: 'tag.created', resourceType: 'tag', changes: null },
  { action: 'category.created', resourceType: 'category', changes: null },
  {
    action: 'article.published',
    resourceType: 'article',
    changes: { status: { old: 'draft', new: 'published' } },
  },
  {
    action: 'settings.updated',
    resourceType: 'settings',
    changes: { blog_name: { old: 'PW Blog', new: 'ProfitableWeb' } },
  },
  { action: 'media.deleted', resourceType: 'media_file', changes: null },
];

function generateExtraErrorEntries(): ErrorLogEntry[] {
  const entries: ErrorLogEntry[] = [];
  const baseDate = new Date('2026-03-04T12:00:00Z');
  for (let i = 0; i < 20; i++) {
    const tpl = ERROR_TEMPLATES[i % ERROR_TEMPLATES.length];
    const user = USERS[i % USERS.length];
    const date = new Date(baseDate.getTime() - i * 7_200_000);
    entries.push({
      id: `err-${String(13 + i).padStart(3, '0')}`,
      timestamp: date.toISOString(),
      level: tpl.level,
      event: tpl.event,
      message: tpl.message,
      traceback:
        tpl.level === 'error'
          ? `Traceback (most recent call last):\n  ...\n${tpl.message}`
          : null,
      requestMethod: tpl.requestMethod,
      requestPath: tpl.requestPath,
      requestId: `req-gen-${String(i).padStart(3, '0')}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      ipAddress: user.ip,
      userAgent: user.ua,
      statusCode: tpl.statusCode,
      context: null,
      resolved: i % 3 === 0,
    });
  }
  return entries;
}

function generateExtraAuditEntries(): AuditLogEntry[] {
  const entries: AuditLogEntry[] = [];
  const baseDate = new Date('2026-03-05T10:00:00Z');
  for (let i = 0; i < 20; i++) {
    const tpl = AUDIT_TEMPLATES[i % AUDIT_TEMPLATES.length];
    const user = USERS[i % 2];
    const date = new Date(baseDate.getTime() - i * 5_400_000);
    entries.push({
      id: `aud-${String(16 + i).padStart(3, '0')}`,
      timestamp: date.toISOString(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: tpl.action,
      resourceType: tpl.resourceType,
      resourceId: tpl.changes ? `res-${String(i).padStart(3, '0')}` : null,
      changes: tpl.changes,
      requestId: `req-aud-gen-${String(i).padStart(3, '0')}`,
      ipAddress: user.ip,
      userAgent: user.ua,
    });
  }
  return entries;
}

// ---------------------------------------------------------------------------
// System Health
// ---------------------------------------------------------------------------

export const MOCK_SYSTEM_HEALTH: SystemHealth = {
  status: 'ok',
  uptimeSeconds: 259200, // 3 дня
  version: '0.1.0',
  pythonVersion: '3.12.3',
  cpuPercent: 12.4,
  disk: { totalGb: 30, usedGb: 11.7, percent: 39.0 },
  memory: { totalGb: 4, usedGb: 2.3, percent: 57.5 },
  services: [
    { name: 'api', connected: true, latencyMs: null, error: null },
    { name: 'db', connected: true, latencyMs: 2, error: null },
    { name: 'storage', connected: true, latencyMs: 45, error: null },
  ],
  errors24h: 3,
};

// ---------------------------------------------------------------------------
// Error Log
// ---------------------------------------------------------------------------

export const MOCK_ERROR_STATS: ErrorStats = {
  last24h: 3,
  last7d: 12,
  last30d: 47,
};

export const MOCK_ERROR_ENTRIES: ErrorLogEntry[] = [
  {
    id: 'err-001',
    timestamp: '2026-03-10T08:14:22Z',
    level: 'error',
    event: 'unhandled_exception',
    message: 'KeyError: "category_id"',
    traceback:
      'Traceback (most recent call last):\n  File "src/api/admin/articles.py", line 45, in create_article\n    category = db.query(Category).filter_by(id=data["category_id"]).first()\nKeyError: "category_id"',
    requestMethod: 'POST',
    requestPath: '/api/admin/articles',
    requestId: 'req-a1b2c3',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
    statusCode: 500,
    context: { payload_keys: ['title', 'content', 'tags'] },
    resolved: false,
  },
  {
    id: 'err-002',
    timestamp: '2026-03-10T06:30:11Z',
    level: 'error',
    event: 's3_upload_failed',
    message: 'ClientError: AccessDenied for PutObject',
    traceback:
      'Traceback (most recent call last):\n  File "src/services/storage.py", line 89, in save\n    self._client.put_object(...)\nbotocore.exceptions.ClientError: AccessDenied',
    requestMethod: 'POST',
    requestPath: '/api/admin/media/upload',
    requestId: 'req-d4e5f6',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
    statusCode: 500,
    context: { bucket: 'pw-media', key: 'images/2026/03/photo.jpg' },
    resolved: false,
  },
  {
    id: 'err-003',
    timestamp: '2026-03-09T22:18:45Z',
    level: 'warning',
    event: 'oauth_token_refresh_failed',
    message: 'Yandex OAuth: token expired, refresh failed',
    traceback: null,
    requestMethod: 'POST',
    requestPath: '/api/auth/refresh',
    requestId: 'req-g7h8i9',
    userId: 'usr-viewer-003',
    userName: 'Анна Петрова',
    userEmail: 'anna@example.com',
    ipAddress: '10.0.0.55',
    userAgent: UA_ANNA,
    statusCode: 401,
    context: { provider: 'yandex', error_code: 'invalid_grant' },
    resolved: true,
  },
  {
    id: 'err-004',
    timestamp: '2026-03-09T15:42:00Z',
    level: 'critical',
    event: 'db_connection_failed',
    message: 'psycopg2.OperationalError: connection refused',
    traceback:
      'Traceback (most recent call last):\n  File "src/core/database.py", line 12, in get_db\n    db = SessionLocal()\npsycopg2.OperationalError: could not connect to server: Connection refused',
    requestMethod: 'GET',
    requestPath: '/api/articles',
    requestId: 'req-j0k1l2',
    userId: null,
    userName: null,
    userEmail: null,
    ipAddress: '203.0.113.42',
    userAgent: UA_BOT,
    statusCode: 500,
    context: { host: 'localhost', port: 5432 },
    resolved: true,
  },
  {
    id: 'err-005',
    timestamp: '2026-03-09T11:05:33Z',
    level: 'error',
    event: 'validation_error',
    message: 'RequestValidationError: slug already exists',
    traceback: null,
    requestMethod: 'POST',
    requestPath: '/api/admin/articles',
    requestId: 'req-m3n4o5',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
    statusCode: 422,
    context: { field: 'slug', value: 'ai-automation' },
    resolved: false,
  },
  {
    id: 'err-006',
    timestamp: '2026-03-08T19:30:00Z',
    level: 'error',
    event: 'media_processing_failed',
    message: 'PIL.UnidentifiedImageError: cannot identify image file',
    traceback:
      'Traceback (most recent call last):\n  File "src/services/media.py", line 67, in process_image\n    img = Image.open(file)\nPIL.UnidentifiedImageError: cannot identify image file',
    requestMethod: 'POST',
    requestPath: '/api/admin/media/upload',
    requestId: 'req-p6q7r8',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
    statusCode: 500,
    context: { filename: 'document.pdf', content_type: 'application/pdf' },
    resolved: true,
  },
  {
    id: 'err-007',
    timestamp: '2026-03-08T14:12:55Z',
    level: 'warning',
    event: 'rate_limit_exceeded',
    message: 'Too many requests from 192.168.1.105',
    traceback: null,
    requestMethod: 'GET',
    requestPath: '/api/articles',
    requestId: 'req-s9t0u1',
    userId: null,
    userName: null,
    userEmail: null,
    ipAddress: '192.168.1.105',
    userAgent: UA_CURL,
    statusCode: 429,
    context: { client_ip: '192.168.1.105', limit: 100, window: '1m' },
    resolved: false,
  },
  {
    id: 'err-008',
    timestamp: '2026-03-07T23:45:10Z',
    level: 'error',
    event: 'unhandled_exception',
    message: 'TypeError: NoneType has no attribute "slug"',
    traceback:
      "Traceback (most recent call last):\n  File \"src/services/articles/queries.py\", line 31, in get_by_slug\n    return article.slug\nAttributeError: 'NoneType' object has no attribute 'slug'",
    requestMethod: 'GET',
    requestPath: '/api/articles/nonexistent-slug',
    requestId: 'req-v2w3x4',
    userId: null,
    userName: null,
    userEmail: null,
    ipAddress: '89.123.45.67',
    userAgent: UA_FIREFOX,
    statusCode: 500,
    context: { slug: 'nonexistent-slug' },
    resolved: true,
  },
  {
    id: 'err-009',
    timestamp: '2026-03-07T10:20:00Z',
    level: 'error',
    event: 's3_delete_failed',
    message: 'ClientError: NoSuchKey',
    traceback: null,
    requestMethod: 'DELETE',
    requestPath: '/api/admin/media/file-123',
    requestId: 'req-y5z6a7',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
    statusCode: 500,
    context: { bucket: 'pw-media', key: 'images/2026/02/old-photo.jpg' },
    resolved: false,
  },
  {
    id: 'err-010',
    timestamp: '2026-03-06T16:55:30Z',
    level: 'warning',
    event: 'slow_query',
    message: 'Query took 2340ms: SELECT articles with tags join',
    traceback: null,
    requestMethod: 'GET',
    requestPath: '/api/admin/articles',
    requestId: 'req-b8c9d0',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
    statusCode: 200,
    context: { query_time_ms: 2340, query: 'articles with tags join' },
    resolved: false,
  },
  {
    id: 'err-011',
    timestamp: '2026-03-05T08:00:00Z',
    level: 'error',
    event: 'email_send_failed',
    message: 'SMTPAuthenticationError: Invalid credentials',
    traceback:
      'Traceback (most recent call last):\n  File "src/services/email.py", line 22, in send\n    server.login(user, password)\nsmtplib.SMTPAuthenticationError: (535, b\'Authentication failed\')',
    requestMethod: 'POST',
    requestPath: '/api/auth/forgot-password',
    requestId: 'req-e1f2g3',
    userId: null,
    userName: null,
    userEmail: null,
    ipAddress: '10.0.0.88',
    userAgent: UA_FIREFOX,
    statusCode: 500,
    context: { smtp_host: 'smtp.example.com' },
    resolved: true,
  },
  {
    id: 'err-012',
    timestamp: '2026-03-04T20:30:15Z',
    level: 'error',
    event: 'unhandled_exception',
    message: 'IntegrityError: duplicate key value violates unique constraint',
    traceback:
      'Traceback (most recent call last):\n  File "src/services/tags.py", line 18, in create\n    db.commit()\nsqlalchemy.exc.IntegrityError: duplicate key value violates unique constraint "tags_slug_key"',
    requestMethod: 'POST',
    requestPath: '/api/admin/tags',
    requestId: 'req-h4i5j6',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
    statusCode: 500,
    context: { tag_slug: 'ai-tools', constraint: 'tags_slug_key' },
    resolved: true,
  },
  ...generateExtraErrorEntries(),
];

// ---------------------------------------------------------------------------
// Audit Log
// ---------------------------------------------------------------------------

export const MOCK_AUDIT_ENTRIES: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-03-10T09:15:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'article.published',
    resourceType: 'article',
    resourceId: 'art-uuid-001',
    changes: { status: { old: 'draft', new: 'published' } },
    requestId: 'req-pub-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-002',
    timestamp: '2026-03-10T09:10:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'article.updated',
    resourceType: 'article',
    resourceId: 'art-uuid-001',
    changes: {
      title: {
        old: 'Как ИИ меняет разработку',
        new: 'Как ИИ трансформирует разработку в 2026',
      },
    },
    requestId: 'req-upd-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-003',
    timestamp: '2026-03-10T08:45:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'media.uploaded',
    resourceType: 'media_file',
    resourceId: 'media-uuid-001',
    changes: null,
    requestId: 'req-upl-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-004',
    timestamp: '2026-03-09T22:00:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'settings.updated',
    resourceType: 'settings',
    resourceId: null,
    changes: {
      max_upload_image_mb: { old: 10, new: 20 },
      max_upload_other_mb: { old: 25, new: 50 },
    },
    requestId: 'req-set-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-005',
    timestamp: '2026-03-09T18:30:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'article.created',
    resourceType: 'article',
    resourceId: 'art-uuid-002',
    changes: null,
    requestId: 'req-crt-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-006',
    timestamp: '2026-03-09T16:15:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'media.deleted',
    resourceType: 'media_file',
    resourceId: 'media-uuid-old',
    changes: null,
    requestId: 'req-del-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-007',
    timestamp: '2026-03-09T14:00:00Z',
    userId: 'usr-viewer-003',
    userName: 'Анна Петрова',
    userEmail: 'anna@example.com',
    action: 'auth.login',
    resourceType: 'user',
    resourceId: 'usr-viewer-003',
    changes: null,
    requestId: 'req-login-001',
    ipAddress: '10.0.0.55',
    userAgent: UA_ANNA,
  },
  {
    id: 'aud-008',
    timestamp: '2026-03-09T12:30:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'user.role_changed',
    resourceType: 'user',
    resourceId: 'usr-viewer-003',
    changes: { role: { old: 'viewer', new: 'author' } },
    requestId: 'req-role-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-009',
    timestamp: '2026-03-08T20:00:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'category.created',
    resourceType: 'category',
    resourceId: 'cat-uuid-001',
    changes: null,
    requestId: 'req-cat-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-010',
    timestamp: '2026-03-08T18:45:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'tag.created',
    resourceType: 'tag',
    resourceId: 'tag-uuid-001',
    changes: null,
    requestId: 'req-tag-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-011',
    timestamp: '2026-03-08T10:00:00Z',
    userId: null,
    userName: null,
    userEmail: null,
    action: 'auth.login_failed',
    resourceType: 'user',
    resourceId: null,
    changes: null,
    requestId: 'req-fail-001',
    ipAddress: '203.0.113.42',
    userAgent: UA_BOT,
  },
  {
    id: 'aud-012',
    timestamp: '2026-03-07T15:20:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'article.deleted',
    resourceType: 'article',
    resourceId: 'art-uuid-old',
    changes: null,
    requestId: 'req-del-art-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-013',
    timestamp: '2026-03-07T11:00:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'storage.sync',
    resourceType: 'settings',
    resourceId: null,
    changes: { synced_files: { old: 0, new: 42 } },
    requestId: 'req-sync-001',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-014',
    timestamp: '2026-03-06T09:00:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'auth.login',
    resourceType: 'user',
    resourceId: 'usr-admin-001',
    changes: null,
    requestId: 'req-login-002',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  {
    id: 'aud-015',
    timestamp: '2026-03-05T17:30:00Z',
    userId: 'usr-admin-001',
    userName: 'Николай',
    userEmail: 'admin@profitableweb.ru',
    action: 'article.updated',
    resourceType: 'article',
    resourceId: 'art-uuid-003',
    changes: {
      content: { old: '(длинный текст...)', new: '(обновлённый текст...)' },
      tags: { old: ['ai', 'tools'], new: ['ai', 'tools', 'automation'] },
    },
    requestId: 'req-upd-002',
    ipAddress: '192.168.1.10',
    userAgent: UA_ADMIN,
  },
  ...generateExtraAuditEntries(),
];
