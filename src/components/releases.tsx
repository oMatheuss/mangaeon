'use client';

import type { Release } from '@/types/releases';
import Link from 'next/link';
import { Select } from '@/components/select';
import { StarButton } from '@/components/star-button';
import { Loader2, PlusSquare } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { clientMangadex } from '@/lib/api/mangadex/client-api';

const ONE_HOUR = 1000 * 60 * 60;
const THIRTY_MIN = 1000 * 60 * 30;

export const Releases = () => {
  const [releaseType, setReleaseType] = useState('manga');

  const releasesQuery = useInfiniteQuery({
    queryKey: ['releases', releaseType],
    queryFn: async ({ pageParam = 1 }) => ({
      pageParam,
      releases: await clientMangadex.releases!(pageParam),
    }),
    getNextPageParam: (last) =>
      !!last.releases ? last.pageParam + 1 : undefined,
    cacheTime: ONE_HOUR,
    staleTime: THIRTY_MIN,
  });

  const releases = releasesQuery.data?.pages.flatMap((x) => x.releases);

  return (
    <>
      <div className='flex justify-between items-end pb-1 mt-4 mb-4 border-b border-base-content/10'>
        <h2 className='font-bold text-xl sm:text-2xl'>Lançamentos</h2>
        <Select
          value={releaseType}
          onChange={setReleaseType}
          name='series-type'
        >
          <option value='manga'>Mangá</option>
          <option value='manhua'>Manhua</option>
          <option value='webtoon'>Webtoon</option>
          <option value='novel'>Novel</option>
        </Select>
      </div>
      <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
        {releases?.map((val, idx) => (
          <ReleaseCard key={`${val.id}-${idx}`} release={val} />
        ))}
      </ul>
      {releasesQuery.hasNextPage && (
        <button
          disabled={releasesQuery.isFetchingNextPage}
          onClick={() => releasesQuery.fetchNextPage()}
          className='w-full flex flex-row justify-center md:justify-start bg-base-200 border border-base-content/20 p-2 rounded enabled:hover:bg-opacity-50 shadow-lg'
        >
          {releasesQuery.isFetchingNextPage ? (
            <Loader2 className='animate-spin' />
          ) : (
            <PlusSquare />
          )}
        </button>
      )}
    </>
  );
};

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard = ({ release }: ReleaseCardProps) => {
  const linkSerie = `/manga/${release.id}`;

  return (
    <li className='relative sm:flex sm:h-48 overflow-hidden bg-base-200 border border-base-content/20 rounded-lg shadow-lg'>
      <StarButton
        serie={{
          id: release.id,
          image: release.cover,
          name: release.title,
        }}
      />
      <div className='min-w-fit bg-base-200'>
        <img
          src={release.cover}
          alt={release.title}
          className='w-full sm:w-32 h-48 object-contain sm:object-cover'
          loading='lazy'
        />
      </div>
      <div className='flex flex-col justify-between overflow-hidden p-4'>
        <h3 className='font-bold text-xl sm:max-h-24 max-w-fit line-clamp-3 tracking-tight'>
          <Link
            href={linkSerie}
            title={release.title}
            className='hover:underline'
          >
            {release.title}
          </Link>
        </h3>
        <h4 className='font-bold text-base-content/75 text-sm truncate my-1'>
          {release.date.toLocaleString('pt-BR')}
        </h4>
        <div className='inline-flex space-x-2 h-6 overflow-y-hidden flex-wrap'>
          {release.tags.map((tag) => (
            <span
              key={tag}
              className='text-xs whitespace-nowrap p-1 rounded bg-neutral text-neutral-content max-w-fit'
            >
              {tag}
            </span>
          ))}
        </div>
        {/* <nav className='mt-auto inline-flex flex-wrap h-[2.25rem] overflow-hidden text-sm font-semibold text-gray-700'>
          {release.chapters.map((chap) => (
            <Link
              key={chap.number}
              className='mt-2 mr-2 px-2 py-1 text-neutral-content bg-neutral rounded-tr-md rounded-b-md hover:bg-neutral-focus'
              href={`/ler/${chap.url.split('/')[4]}`}
            >
              {chap.number}
            </Link>
          ))}
        </nav> */}
      </div>
    </li>
  );
};
