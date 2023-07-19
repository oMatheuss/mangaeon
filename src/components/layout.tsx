import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from '@/components/navbar';

export const Layout = () => {
  return (
    <div className='container px-3 sm:mx-auto'>
      <Navbar />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
};
