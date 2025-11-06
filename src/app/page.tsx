import { FeaturedScroll } from '@/components/featured-scroll';
import { MostReadScroll } from '@/components/most-read-scroll';
import { ReleaseList } from '@/components/releases-list';
import { SearchBar } from '@/components/ui/search-bar';
import { mangadex } from '@/lib/api/mangadex/api';
import { ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 21600;

export default async function Home() {
  const mostRead = await mangadex.mostRead();
  const releases = await mangadex.releases(1);

  return (
    <div className='flex flex-col'>
      <SearchBar />
      <FeaturedScroll />
      <MostReadScroll items={mostRead} />
      <ReleaseList releases={releases} />
      <NextPageButton />
    </div>
  );
}

const NextPageButton = () => (
  <div className='mt-3 flex justify-end'>
    <Link
      href='/releases?page=2'
      className='group flex h-10 w-10 items-center justify-center rounded-btn hover:bg-base-content/10'
    >
      <ArrowRightCircle
        aria-label='Proxima página'
        className='group-hover:stroke-primary-focus h-6 w-6'
      />
    </Link>
  </div>
);
