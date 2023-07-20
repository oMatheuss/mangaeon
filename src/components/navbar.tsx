import { BookOpen, Clock, Heart, Home, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { icon: Home, text: 'Home', to: '/' },
  { icon: Clock, text: 'Recentes', to: '/recents' },
  { icon: Heart, text: 'Favoritos', to: '/liked' },
];

export const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen((x) => !x);

  return (
    <nav className='sticky top-0 border-b z-10 backdrop-blur-lg'>
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
          className='hidden aria-expanded:block w-full md:block md:w-auto'
        >
          <ul className='font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-inherit dark:bg-gray-800 md:dark:bg-inherit dark:border-gray-700'>
            {links.map((l) => (
              <li>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500'
                      : 'flex items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                  }
                  aria-current='page'
                >
                  <l.icon className='pb-1 mr-2' /> {l.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
