'use client';

import type { MostRead, MostReadResponse } from '@/types/most-read';
import { Image } from '@/components/image';
import Link from 'next/link';
import { ImageOff, Loader2, Plus } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toErrorReponse } from '@/lib/utils';

const fetchMostRead = async (page: number) => {
  const res = await fetch(`/api/home/most_read?page=${page}`);
  if (!res.ok) throw toErrorReponse(res);
  const result: MostReadResponse = await res.json();
  return { mostRead: result.most_read, page };
};

const ONE_HOUR = 1000 * 60 * 60;
const THIRTY_MIN = 1000 * 60 * 30;

export const MostReadScroll = () => {
  const mostReadQuery = useInfiniteQuery({
    queryKey: ['most_read'],
    queryFn: ({ pageParam = 1 }) => fetchMostRead(pageParam),
    getNextPageParam: (last) => (!last.mostRead ? undefined : last.page + 1),
    cacheTime: ONE_HOUR,
    staleTime: THIRTY_MIN,
  });

  const mostRead =
    mostReadQuery.data?.pages
      .filter((x) => Array.isArray(x.mostRead))
      .flatMap((x) => x.mostRead as MostRead[]) ?? [];

  return (
    <>
      <div className='flex justify-between items-end mt-8 mb-4 border-b border-light-b dark:border-dark-b'>
        <h2 className='font-bold text-xl sm:text-2xl'>Mais Lidos</h2>
      </div>
      <ul className='w-full pb-4 overflow-x-auto grid grid-flow-col auto-cols-max gap-x-3'>
        {mostRead.map((item) => (
          <MostReadCard key={item.id_serie} item={item} />
        ))}
        {(mostReadQuery.hasNextPage || mostReadQuery.isLoading) && (
          <MosteReadSkeleton
            onClick={mostReadQuery.fetchNextPage}
            isLoading={
              mostReadQuery.isFetchingNextPage || mostReadQuery.isLoading
            }
          />
        )}
      </ul>
    </>
  );
};

interface MostReadCardProps {
  item: MostRead;
}

const MostReadCard = ({ item }: MostReadCardProps) => {
  return (
    <li className='relative flex flex-col items-center overflow-hidden shadow-md bg-slate-300 dark:bg-slate-700/10 rounded-lg border border-light-b dark:border-dark-b'>
      <Link href={item.link}>
        <div className='min-w-fit overflow-hidden dark:shadow-dark-b shadow-md'>
          <Image
            sources={[
              [
                { src: item.cover_avif, type: 'image/avif' },
                { src: item.cover, type: 'image/jpg' },
              ],
              [
                { src: item.cover_thumb_avif, type: 'image/avif' },
                { src: item.cover_thumb, type: 'image/jpg' },
              ],
            ]}
            alt={item.serie_name}
            className='w-32 h-48 object-cover object-center transition-transform hover:scale-110'
            fallback={
              <div className='w-32 h-48 flex justify-center items-center'>
                <ImageOff className='h-10 w-10' />
              </div>
            }
            loading='lazy'
          />
        </div>
      </Link>
      <div className='flex items-center h-16 w-32 px-2'>
        <Link
          href={item.link}
          className='line-clamp-3 w-full text-xs text-center font-bold tracking-wide hover:underline'
        >
          {item.serie_name}
        </Link>
      </div>
    </li>
  );
};

interface MosteReadSkeletonProps {
  onClick: () => void;
  isLoading: boolean;
}

const MosteReadSkeleton = ({ isLoading, onClick }: MosteReadSkeletonProps) => {
  return (
    <li className='group relative overflow-hidden shadow-lg rounded-lg border border-light-b dark:border-dark-b cursor-pointer'>
      <button
        onClick={onClick}
        className='flex justify-center items-center w-32 h-64 bg-slate-300 dark:bg-slate-700 group-hover:bg-opacity-30'
      >
        {isLoading ? (
          <Loader2 className='h-10 w-10 animate-spin' />
        ) : (
          <Plus className='h-10 w-10 rounded-full shadow-xl group-hover:bg-light-b dark:group-hover:bg-dark-b transition-transform group-hover:rotate-90' />
        )}
      </button>
    </li>
  );
};
