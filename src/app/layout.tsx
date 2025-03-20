import type { Metadata, Viewport } from 'next';
import './globals.css';
import MainLayout from '../components/MainLayout';

export const metadata: Metadata = {
  title: 'POC Cabine imersiva',
  description: 'Cabine imersiva inovvati'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
