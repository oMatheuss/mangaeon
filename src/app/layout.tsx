import '@/index.css';

import type { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ClientProviders } from '@/components/client-providers';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'MangaLivre - Clone',
  description: 'Leitor de Mangás',
  icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/logo.svg' }],
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='pt-BR'>
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
