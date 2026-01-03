import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProfitableWeb Admin",
  description: "Admin panel for ProfitableWeb Research Lab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
