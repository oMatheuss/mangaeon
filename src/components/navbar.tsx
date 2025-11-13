'use client';

import { ArrowLeft, BookOpen, Heart, Home, Settings } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { icon: Home, text: 'Home', to: '/' },
  { icon: Heart, text: 'Favorites', to: '/favorites' },
  { icon: Settings, text: 'Settings', to: '/settings' },
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
        className='fixed top-0 right-0 left-0 z-10 -translate-y-(--nav-offset) transition-transform'
      >
        <div className='border-b-base-content/10 bg-base-200/90 w-full overflow-x-clip border-b'>
          <div className='container mx-auto flex items-center justify-between p-2'>
            <button
              className='hover:bg-base-content/10 pwa:inline-flex hidden size-10 items-center justify-center rounded-lg focus:ring-2 focus:outline-hidden'
              onClick={router.back}
            >
              <ArrowLeft className='h-8 w-8' />
            </button>

            <Link href='/' className='flex items-center px-3 py-1.5'>
              <BookOpen aria-hidden={true} className='h-6 w-6 sm:mr-2' />
              <span className='sr-only font-bold sm:not-sr-only'>
                MANGÁ ÉON
              </span>
            </Link>

            <ul className='flex gap-2'>
              {links.map((link) => {
                return (
                  <li key={link.to}>
                    <Link
                      aria-current={pathname === link.to ? 'page' : undefined}
                      href={link.to}
                      className='rounded-field hover:bg-base-content/10 aria-[current]:bg-primary aria-[current]:text-primary-content flex items-center px-3 py-1.5 font-medium sm:gap-1'
                    >
                      <link.icon aria-hidden={true} />
                      <span className='sr-only sm:not-sr-only'>
                        {link.text}
                      </span>
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
