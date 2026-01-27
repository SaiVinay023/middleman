import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/utils/queryClient';

export const metadata: Metadata = {
  title: 'Middleman App',
  description: 'Next.js 15 + Capacitor 8 Mobile App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className="safe-area-padding">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
