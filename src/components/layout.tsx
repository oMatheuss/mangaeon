import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main className='container px-3 sm:mx-auto'>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
};
