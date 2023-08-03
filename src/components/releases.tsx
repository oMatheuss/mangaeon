import type { Release, Scan, ReleasesReponse } from '@/types/releases';
import { Link } from 'react-router-dom';
import { Image } from '@/components/image';
import { StarButton } from '@/components/star-button';
import { ImageOff, Loader2, PlusSquare } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toErrorReponse } from '@/lib/utils';

const fetchReleases = async (page: number) => {
  const res = await fetch(`/api/home/releases?page=${page}`);
  if (!res.ok) throw toErrorReponse(res);
  const result: ReleasesReponse = await res.json();
  return { releases: result.releases, page };
};

const ONE_HOUR = 1000 * 60 * 60;
const THIRTY_MIN = 1000 * 60 * 30;

export const Releases = () => {
  const releasesQuery = useInfiniteQuery({
    queryKey: ['releases'],
    queryFn: ({ pageParam = 1 }) => fetchReleases(pageParam),
    getNextPageParam: (last) => (!last.releases ? undefined : last.page + 1),
    cacheTime: ONE_HOUR,
    staleTime: THIRTY_MIN,
  });

  const releases =
    releasesQuery.data?.pages
      .filter((x) => Array.isArray(x.releases))
      .flatMap((x) => x.releases as Release[]) ?? [];

  return (
    <>
      <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
        {releases.map((val) => (
          <ReleaseCard key={val.id_serie} release={val} />
        ))}
      </ul>
      {releasesQuery.hasNextPage && (
        <button
          disabled={releasesQuery.isFetchingNextPage}
          onClick={() => releasesQuery.fetchNextPage()}
          className='w-full flex flex-row justify-center md:justify-start border border-light-b dark:border-dark-b p-2 rounded bg-light dark:bg-dark enabled:hover:bg-light-b dark:enabled:hover:bg-dark-b shadow-lg'
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
  const scans = release.chapters
    .flatMap((x) => Object.entries(x.scanlators))
    .flatMap((x) => x[1])
    .reduce((prev, curr) => {
      if (prev.findIndex((x) => x.id_scanlator === curr.id_scanlator) < 0) {
        prev.push(curr);
      }
      return prev;
    }, [] as Scan[])
    .map((x) => x.name)
    .join(', ');

  return (
    <li className='relative w-full sm:flex sm:h-48 overflow-hidden bg-light dark:bg-dark border border-light-b dark:border-dark-b rounded shadow-lg'>
      <StarButton
        serie={{
          id: release.id_serie,
          image: release.image,
          link: release.link,
          name: release.name,
        }}
      />
      <Link
        to={release.link}
        className='min-w-fit focus:outline outline-indigo-600 outline-1 -outline-offset-1'
      >
        <Image
          source={[release.image_avif, 'image/avif']}
          src={release.image}
          alt={release.name}
          className='w-full sm:w-32 h-48 border-b-2 sm:border-none object-contain sm:object-cover'
        >
          <div className='bg-slate-300 dark:bg-slate-700/10 w-full sm:w-32 h-48 flex justify-center items-center'>
            <ImageOff className='h-10' />
          </div>
        </Image>
      </Link>
      <div className='p-4 flex flex-col justify-between leading-normal text-center sm:text-left'>
        <h3 className='font-bold text-xl'>
          <Link to={release.link} className='hover:underline'>
            {release.name}
          </Link>
        </h3>
        <h4 className='font-light text-current text-opacity-25 text-sm'>
          {scans}
        </h4>
        <nav className='select-none'>
          {release.chapters.map((chap) => (
            <Link
              key={chap.number}
              className='inline-block bg-gray-200 rounded-sm px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mt-2 hover:bg-gray-300'
              to={chap.url}
            >
              {chap.number}
            </Link>
          ))}
        </nav>
      </div>
    </li>
  );
};
