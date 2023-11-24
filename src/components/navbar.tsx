'use client';

import { ArrowLeft, BookOpen, Heart, Home, Palette } from 'lucide-react';
import { useEffect, useRef } from 'react';
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

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastPosition = window.scrollY;

    const handleScroll = () => {
      if (navRef.current == null) return;

      const scrollY = window.scrollY;
      const navbarMinOffset = navRef.current.offsetHeight;
      const deltaPosition = scrollY - lastPosition;

      if (scrollY > navbarMinOffset && deltaPosition > 0) {
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

  return (
    <div className='h-14'>
      <nav
        ref={navRef}
        className='fixed left-0 right-0 top-0 z-10 transition-transform -translate-y-[var(--nav-offset)]'
      >
        <div className='border-b border-b-base-content/10 w-full overflow-x-clip bg-base-200/90'>
          <div className='max-w-screen-2xl flex items-center justify-between mx-auto p-2'>
            <button
              className='hidden pwa:inline-flex items-center w-10 h-10 justify-center rounded-lg hover:bg-base-content/10 focus:outline-none focus:ring-2'
              onClick={router.back}
            >
              <ArrowLeft className='w-8 h-8' />
            </button>

            <Link href='/' className='flex items-center py-2 px-3'>
              <BookOpen className='w-6 h-6 sm:mr-2' />
              <span className='font-bold sr-only sm:not-sr-only'>
                MANGÁ ÉON
              </span>
            </Link>

            <ul className='flex flex-row'>
              {links.map((link) => {
                return (
                  <li key={link.to} className='inline-flex font-medium'>
                    <Link
                      aria-current={pathname === link.to ? 'page' : undefined}
                      href={link.to}
                      className='inline-flex items-center hover:text-primary-focus aria-[current]:text-primary py-2 px-3'
                    >
                      <link.icon className='mr-2 stroke-3' />
                      <div className='sr-only sm:not-sr-only pt-1'>
                        {link.text}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
