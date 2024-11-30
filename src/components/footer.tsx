import { BookOpen, Mail } from 'lucide-react';
import Link from 'next/link';
import { MangadexIcon } from './icons/mangadex-icon';

const links = [
  { title: 'Contact', icon: Mail, href: 'mailto:contato@mangaeon.com' },
  { title: 'Mangadex', icon: MangadexIcon, href: 'https://mangadex.org' },
];

export function Footer() {
  return (
    <footer className='container my-8 px-3 sm:mx-auto'>
      <hr className='my-6 border-base-content/10 sm:mx-auto lg:my-4' />
      <div className='mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <Link href='/' className='mb-4 flex items-center sm:mb-0'>
          <BookOpen className='mr-3 h-8 w-8 stroke-current' />
          <span className='self-center text-lg font-semibold sm:text-2xl'>
            Mangá Éon
          </span>
        </Link>
        <ul className='mx-1 flex flex-wrap items-center text-sm font-medium sm:mx-0'>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className='group mr-4 flex items-center md:mr-6'
                target='_blank'
              >
                <link.icon className='mr-1 h-4 w-4' />
                <span className='group-hover:underline'>{link.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className='mb-1'>
        © 2024{' '}
        <Link href='/' className='hover:underline'>
          MangáÉon™
        </Link>
        . All Rights Reserved.
      </p>
      <p className='text-sm'>
        The works contained on this page are authored by third parties. All
        material available is loaded from the{' '}
        <a
          href='https://api.mangadex.org'
          className='hover:underline'
          target='_blank'
        >
          MangaDex API
        </a>
        .
      </p>
    </footer>
  );
}
