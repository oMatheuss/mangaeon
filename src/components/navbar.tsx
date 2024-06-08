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
        className='fixed left-0 right-0 top-0 z-10 -translate-y-[var(--nav-offset)] transition-transform'
      >
        <div className='w-full overflow-x-clip border-b border-b-base-content/10 bg-base-200/90'>
          <div className='mx-auto flex max-w-screen-2xl items-center justify-between p-2'>
            <button
              className='hidden h-10 w-10 items-center justify-center rounded-lg hover:bg-base-content/10 focus:outline-none focus:ring-2 pwa:inline-flex'
              onClick={router.back}
            >
              <ArrowLeft className='h-8 w-8' />
            </button>

            <Link href='/' className='flex items-center px-3 py-2'>
              <BookOpen className='h-6 w-6 sm:mr-2' />
              <span className='sr-only font-bold sm:not-sr-only'>
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
                      className='hover:text-primary-focus inline-flex items-center px-3 py-2 aria-[current]:text-primary'
                    >
                      <link.icon className='stroke-3 mr-2' />
                      <div className='sr-only pt-1 sm:not-sr-only'>
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
