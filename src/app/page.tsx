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
    <div className='flex flex-col my-3'>
      <SearchBar />
      <FeaturedScroll />
      <MostReadScroll items={mostRead} focused={mostRead.pop()!} />
      <Releases releases={releases} />
      <NextPageButton />
    </div>
  );
}

const NextPageButton = () => (
  <div className='flex justify-center mt-3'>
    <Link
      href='/lancamentos/2'
      className='group w-32 max-w-full h-10 flex items-center justify-center rounded bg-primary hover:bg-primary-focus'
    >
      <ArrowRightCircle
        aria-label='Proxima página'
        className='w-6 h-6 stroke-primary-content'
      />
    </Link>
  </div>
);
