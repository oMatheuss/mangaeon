import { BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className='container px-3 sm:mx-auto my-8'>
      <div className='sm:flex sm:items-center sm:justify-between'>
        <a
          href='https://mangalivre.vercel.app/'
          className='flex items-center mb-4 sm:mb-0'
        >
          <BookOpen className='h-8 w-8 mr-3 stroke-current' />
          <span className='self-center text-lg sm:text-2xl font-semibold dark:text-white'>
            Mangá Livre
          </span>
        </a>
        <ul className='flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 mx-1 sm:mx-0'>
          <li>
            <a href='#' className='group mr-4 md:mr-6 flex items-center'>
              <svg
                className='w-4 h-4 inline mr-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 21 16'
              >
                <path d='M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z' />
              </svg>
              <span className='group-hover:underline'>Discord</span>
            </a>
          </li>
          <li>
            <a href='#' className='hover:underline'>
              Contato
            </a>
          </li>
        </ul>
      </div>
      <hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-4' />
      <span className='block text-sm text-gray-500 sm:text-center dark:text-gray-400'>
        © 2023{' '}
        <a href='https://mangalivre.vercel.app/' className='hover:underline'>
          MangáLivre™
        </a>
        . All Rights Reserved.
      </span>
    </footer>
  );
};
