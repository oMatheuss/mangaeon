import { FeaturedScroll } from '@/components/featured-scroll';
import { MostReadScroll } from '@/components/most-read-scroll';
import { Releases } from '@/components/releases';
import { SearchBar } from '@/components/search-bar';
import { mangadex } from '@/lib/api/mangadex/api';
import { ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 21600;

export default async function Home() {
  const mostRead = await mangadex.mostRead();
  const releases = await mangadex.releases(1);

  return (
    <div className='my-3 flex flex-col'>
      <SearchBar />
      <FeaturedScroll />
      <MostReadScroll items={mostRead} />
      <Releases releases={releases} />
      <NextPageButton />
    </div>
  );
}

const NextPageButton = () => (
  <div className='mt-3 flex justify-center'>
    <Link
      href='/lancamentos/2'
      className='hover:bg-primary-focus group flex h-10 w-32 max-w-full items-center justify-center rounded bg-primary'
    >
      <ArrowRightCircle
        aria-label='Proxima página'
        className='h-6 w-6 stroke-primary-content'
      />
    </Link>
  </div>
);
