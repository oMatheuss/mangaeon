'use client';

import {
  ArrowLeft,
  BookOpen,
  Heart,
  Home,
  MenuIcon,
  Palette,
  XIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { icon: Home, text: 'Home', to: '/' },
  { icon: Heart, text: 'Favoritos', to: '/favoritos' },
  { icon: Palette, text: 'Tema', to: '/tema' },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen((x) => !x);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastPosition = window.scrollY;

    const handleScroll = () => {
      if (navRef.current == null) return;

      const scrollY = window.scrollY;
      const navbarMinOffset = navRef.current.offsetHeight;
      const deltaPosition = scrollY - lastPosition;

      if (scrollY > navbarMinOffset && deltaPosition > 0) {
        setOpen(false);
        navRef.current.style.setProperty('--nav-offset', '100%');
      } else if (deltaPosition < 0) {
        navRef.current.style.setProperty('--nav-offset', '0%');
      }

      lastPosition = scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const tabIndexMobile = isOpen ? 0 : -1;

  return (
    <nav
      ref={navRef}
      className='border-b border-b-base-content/10 sticky left-0 right-0 top-0 z-10 transition-transform -translate-y-[var(--nav-offset)]'
    >
      <div className='relative w-full overflow-x-clip bg-base-200/90 backdrop-blur'>
        <div className='max-w-screen-2xl flex items-center justify-between mx-auto p-3'>
          <button
            className='hidden pwa:inline-flex items-center w-10 h-10 justify-center rounded-lg hover:bg-base-content/10 focus:outline-none focus:ring-2'
            onClick={router.back}
          >
            <ArrowLeft className='w-8 h-8' />
          </button>

          <Link href='/' className='flex items-center py-2 px-3'>
            <BookOpen className='w-6 h-6 sm:mr-2' />
            <span className='hidden sm:inline'>MANGÁ ÉON</span>
          </Link>

          {/* Desktop */}
          <div className='hidden md:flex'>
            <ul className='flex flex-row space-x-8'>
              {links.map((link) => {
                return (
                  <li key={link.to} className='inline-flex'>
                    <Link
                      aria-current={pathname === link.to ? 'page' : undefined}
                      href={link.to}
                      className='inline-flex items-center hover:text-primary-focus aria-[current]:text-primary'
                    >
                      <div className='font-bold pt-1'>{link.text}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            onClick={toggleOpen}
            type='button'
            className='w-10 h-10 rounded-lg md:hidden hover:bg-base-content/10 focus:outline-none focus:ring-2 swap swap-flip'
          >
            <input type='checkbox' hidden checked={isOpen} readOnly />
            <MenuIcon className='w-8 h-8 swap-off fill-current' />
            <XIcon className='w-8 h-8 swap-on fill-current' />
          </button>
        </div>

        {/* Mobile */}
        <div
          data-expanded={isOpen}
          className='border-b border-b-base-content/10 translate-x-full data-[expanded=true]:translate-x-0 md:hidden transition-transform flex absolute top-full w-full bg-base-200/90 backdrop-blur '
        >
          <div className='px-4 w-full flex-col mb-2'>
            <hr className='mb-2 border-base-content/10' />
            <ul className='font-medium leading-none flex flex-col space-y-2'>
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className='flex items-center py-2 px-3 rounded hover:bg-base-content/10'
                    tabIndex={tabIndexMobile}
                  >
                    <l.icon className='mr-2' />
                    <span className='pt-1'>{l.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
