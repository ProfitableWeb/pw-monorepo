import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Превью статьи',
};

/**
 * Минимальный layout для preview-роута.
 * Наследует root layout (шрифты, CSS-переменные, Providers),
 * но не добавляет AppBar/Footer.
 */
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
