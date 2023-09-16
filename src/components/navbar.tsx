'use client';

import { useUser } from '@/lib/user';
import {
  ArrowLeft,
  BookOpen,
  Heart,
  Home,
  LogIn,
  LogOut,
  MenuIcon,
  User,
  XIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';

const links = [
  { icon: Home, text: 'Home', to: '/' },
  { icon: Heart, text: 'Favoritos', to: '/liked' },
];

export const Navbar = () => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen((x) => !x);
  const navRef = useRef<HTMLElement>(null);

  const [user] = useUser();

  useEffect(() => {
    let lastPosition = window.scrollY;
    const closedClass = '-translate-y-full';

    const handleScroll = () => {
      if (navRef.current == null) return;

      const scrollY = window.scrollY;
      const navbarMinOffset = navRef.current.offsetHeight;
      const deltaPosition = scrollY - lastPosition;

      if (scrollY > navbarMinOffset && deltaPosition > 0) {
        setOpen(false);
        navRef.current.classList.add(closedClass);
      } else if (deltaPosition < 0) {
        navRef.current.classList.remove(closedClass);
      }

      lastPosition = scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

    /**
     * *** NOTE ***
     * 'isOpen' is necessary on dependency array because it will cause react
     * to call the cleanup function once the navbar is set open.
     * The result is that the scroll caused by the navbar opening do not trigger
     * the handleScroll function inside this effect.
     * *** NOTE ***
     */
  }, [isOpen]);

  const signIn = async () => {
    const { auth, signInWithPopup, GoogleAuthProvider } = await import(
      '@/lib/auth'
    );
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    const { signOut, auth } = await import('@/lib/auth');
    await signOut(auth);
  };

  return (
    <nav
      ref={navRef}
      className='sticky top-0 z-10 bg-base-200/95 backdrop-blur shadow transition-transform max-h-screen'
    >
      <div className='max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto px-4 py-2'>
        <button
          className='hidden pwa:inline-flex items-center w-10 h-10 justify-center rounded-lg hover:bg-base-content/10 focus:outline-none focus:ring-2'
          onClick={router.back}
        >
          <ArrowLeft className='w-8 h-8' />
        </button>
        <Link href='/' className='flex items-center m-2'>
          <BookOpen className='w-6 h-6 mr-2' /> MANGÁ LIVRE
        </Link>
        <button
          onClick={toggleOpen}
          type='button'
          className='w-10 h-10 rounded-lg md:hidden hover:bg-base-content/10 focus:outline-none focus:ring-2 swap swap-flip'
        >
          <input type='checkbox' checked={isOpen} readOnly />
          <MenuIcon className='w-8 h-8 swap-off fill-current' />
          <XIcon className='w-8 h-8 swap-on fill-current' />
        </button>
        <div
          aria-expanded={isOpen}
          className='hidden aria-expanded:flex w-full md:flex md:w-auto flex-col md:flex-row mb-2 md:m-0'
        >
          <hr className='md:hidden my-2 border-base-content/10' />
          <ul className='font-medium leading-none flex md:items-center flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-8'>
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  href={l.to}
                  className='flex items-center py-2 px-3 rounded hover:bg-base-content/10 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0'
                  aria-current='page'
                >
                  <l.icon className='mr-2' />
                  <span className='pt-1'>{l.text}</span>
                </Link>
              </li>
            ))}
          </ul>
          <hr className='md:hidden my-2 border-base-content/10' />
          <div className='hidden md:block h-10 w-[1px] mx-6 bg-base-content/10'></div>
          {user === null ? (
            <button
              className='flex items-center justify-end py-2 px-3 rounded-lg hover:bg-base-content/10 focus:outline-none focus:ring-2'
              onClick={signIn}
            >
              Login <LogIn className='ml-2' />
            </button>
          ) : (
            <>
              <div className='flex flex-row items-center space-x-3 m-3 md:m-0 md:mr-3'>
                <Avatar.Root>
                  <Avatar.Image
                    src={user.photoURL!}
                    alt={user.displayName!}
                    className='h-6 w-6 rounded-full outline outline-2 outline-offset-2 outline-current hover:outline-blue-700'
                  />
                  <Avatar.Fallback delayMs={600}>
                    <User />
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className='md:hidden'>{user?.displayName}</div>
              </div>
              <button
                className='flex items-center justify-end py-2 px-3 rounded-lg hover:bg-base-content/10 focus:outline-none focus:ring-2'
                onClick={signOut}
              >
                Logout <LogOut className='ml-2' />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
