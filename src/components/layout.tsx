import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from '@/components/navbar';

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main className='container px-3 sm:mx-auto'>
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  );
};
