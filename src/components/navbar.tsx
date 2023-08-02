import { useUser } from '@/lib/user';
import { BookOpen, Heart, Home, LogIn, LogOut, Menu, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as Avatar from '@radix-ui/react-avatar';

const links = [
  { icon: Home, text: 'Home', to: '/' },
  //{ icon: Clock, text: 'Recentes', to: '/recents' },
  { icon: Heart, text: 'Favoritos', to: '/liked' },
];

export const Navbar = () => {
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
        navRef.current.classList.add(closedClass);
      } else if (deltaPosition < 0 || scrollY < navbarMinOffset) {
        setOpen(false);
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
     * The result is that the scroll cause by the navbar opening do not trigger
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
      className='sticky top-0 border-b z-10 backdrop-blur-lg transition-transform'
    >
      <div className='max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <Link to='/' className='flex items-center'>
          <BookOpen className='mr-2' />
          <span>MANGÁ LIVRE</span>
        </Link>
        <button
          onClick={toggleOpen}
          type='button'
          className='inline-flex items-center w-10 h-10 justify-center rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
        >
          <span className='sr-only'>Abrir o menu</span>
          <Menu className='w-5 h-5' aria-hidden='true' />
        </button>
        <div
          aria-expanded={isOpen}
          className='hidden aria-expanded:flex w-full md:flex md:w-auto flex-col md:flex-row p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 rounded-lg bg-gray-50 md:border-0 md:bg-inherit dark:bg-gray-800 md:dark:bg-inherit dark:border-gray-700'
        >
          <ul className='font-medium flex flex-col md:flex-row md:space-x-8 md:mr-8'>
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500'
                      : 'flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                  }
                  aria-current='page'
                >
                  <l.icon className='mr-2' /> {l.text}
                </NavLink>
              </li>
            ))}
          </ul>
          <hr className='md:hidden my-2 border-inherit' />
          {user === null ? (
            <button
              className='w-full flex items-center justify-end py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
              onClick={signIn}
            >
              Login <LogIn className='ml-2' />
            </button>
          ) : (
            <>
              <div className='flex flex-row space-x-3 m-3 md:m-0 md:mr-3 md:w-full'>
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
                className='w-full flex items-center justify-end py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
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
