export const MAX_LINKS = 5;

/**
 * Провайдеры, доступные для подключения.
 * Иностранные провайдеры входа в проекте не используются — см. ADR-002.
 */
export const OAUTH_PROVIDERS = ['yandex', 'telegram'] as const;

/**
 * Подключить нельзя, но у части пользователей привязка осталась с прежней
 * версии — показываем её, чтобы аккаунт можно было отвязать.
 */
export const LEGACY_OAUTH_PROVIDERS = ['google'] as const;

export const PROVIDER_LABELS: Record<string, string> = {
  yandex: 'Яндекс',
  telegram: 'Telegram',
  google: 'Google',
};
