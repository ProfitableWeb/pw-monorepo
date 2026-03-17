/** SSR: абсолютный URL (сервер не знает про nginx), клиент: relative через nginx */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === 'undefined' ? 'http://localhost:8000/api' : '/api');
