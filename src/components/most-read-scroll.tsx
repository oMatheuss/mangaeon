import type { MostRead, MostReadResponse } from '@/types/most-read';
import { Image } from '@/components/image';
import { Link } from 'react-router-dom';
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
      <div className='flex justify-between items-end pb-1 my-4 border-b border-light-b dark:border-dark-b'>
        <h2 className='font-bold text-xl sm:text-2xl'>Mais Lidos</h2>
      </div>
      <ul className='w-full h-56 overflow-x-scroll grid grid-flow-col auto-cols-max gap-x-3'>
        {mostRead.map((item) => (
          <MostReadCard key={item.id_serie} item={item} />
        ))}
        {mostReadQuery.hasNextPage && (
          <MosteReadSkeleton
            onClick={mostReadQuery.fetchNextPage}
            isLoading={mostReadQuery.isFetchingNextPage}
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
    <li className='relative overflow-hidden shadow-lg rounded-lg border-2 border-light-b dark:border-dark-b hover:brightness-75'>
      <Link to={item.link}>
        <div className='min-w-fit bg-slate-300 dark:bg-slate-700/10'>
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
            className='w-36 h-56 object-cover object-center'
            fallback={
              <div className='w-36 h-56 flex justify-center items-center'>
                <ImageOff className='h-10' />
              </div>
            }
            loading='lazy'
          />
        </div>
      </Link>
    </li>
  );
};

interface MosteReadSkeletonProps {
  onClick: () => void;
  isLoading: boolean;
}

const MosteReadSkeleton = ({ isLoading, onClick }: MosteReadSkeletonProps) => {
  return (
    <li className='group relative overflow-hidden shadow-lg rounded-lg border-2 border-light-b dark:border-dark-b cursor-pointer'>
      <button
        onClick={onClick}
        className='min-w-fit bg-slate-300 dark:bg-slate-700 group-hover:bg-opacity-30'
      >
        <div className='w-36 h-56 flex justify-center items-center'>
          {isLoading ? (
            <Loader2 className='h-10 w-10 animate-spin' />
          ) : (
            <Plus className='h-10 w-10 rounded-full shadow-xl group-hover:bg-light-b dark:group-hover:bg-dark-b transition-transform group-hover:rotate-90' />
          )}
        </div>
      </button>
    </li>
  );
};
