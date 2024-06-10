import '@/index.css';

import type { Viewport } from 'next';
import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ClientProviders } from '@/components/client-providers';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: { default: 'Mangá Éon', template: '%s | MangaEon' },
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
    title: 'Mangá Éon',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'Mangá Éon',
  other: {
    'mobile-web-app-capable': 'yes',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'CFeJ-y3WPijLH_DeRueZt7i9eudIAuUjLi7YUKq5Vlc',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

const font = Quicksand({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-quicksand',
});

const themeScript = `if (typeof localStorage["theme"] === "string") document.documentElement.setAttribute("data-theme", localStorage["theme"]);`;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang='pt-BR' className={font.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ClientProviders>
          <Navbar />
          <main className='container px-3 sm:mx-auto'>{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
