import '@/index.css';

import type { Metadata } from 'next';
import { Comfortaa } from 'next/font/google';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ClientProviders } from '@/components/client-providers';
import { ThemeApplier } from '@/lib/theme';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: { default: 'MangaLivre', template: '%s - ML' },
  description: 'Leitor de Mangás',
  icons: [
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
  ],
  appleWebApp: {
    capable: true,
    title: 'Mangá Livre',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'Mangá Livre',
  other: {
    'mobile-web-app-capable': 'yes',
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  verification: {
    google: 'CFeJ-y3WPijLH_DeRueZt7i9eudIAuUjLi7YUKq5Vlc',
  },
};

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-comfortaa',
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='pt-BR' className={comfortaa.variable}>
      <body>
        <ClientProviders>
          <ThemeApplier />
          <Navbar />
          <main className='container px-3 sm:mx-auto'>{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
