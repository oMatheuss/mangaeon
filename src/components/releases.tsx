import type { Release, Scan, ReleasesReponse } from '@/types/releases';
import { Link } from 'react-router-dom';
import { Image } from '@/components/image';
import { Select } from '@/components/select';
import { StarButton } from '@/components/star-button';
import { ImageOff, Loader2, PlusSquare } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toErrorReponse } from '@/lib/utils';
import { useState } from 'react';

const fetchReleases = async (page: number, type: string) => {
  const res = await fetch(`/api/home/releases?page=${page}&type=${type}`);
  if (!res.ok) throw toErrorReponse(res);
  const result: ReleasesReponse = await res.json();
  return { releases: result.releases, page };
};

const ONE_HOUR = 1000 * 60 * 60;
const THIRTY_MIN = 1000 * 60 * 30;

export const Releases = () => {
  const [releaseType, setReleaseType] = useState('manga');

  const releasesQuery = useInfiniteQuery({
    queryKey: ['releases', releaseType],
    queryFn: ({ pageParam = 1 }) => fetchReleases(pageParam, releaseType),
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
      <div className='flex justify-between items-end pb-1 mt-4 mb-3 border-b border-light-b dark:border-dark-b'>
        <h2 className='font-bold text-xl sm:text-2xl'>Lançamentos</h2>
        <Select value={releaseType} onChange={setReleaseType}>
          <option value='manga'>Mangá</option>
          <option value='manhua'>Manhua</option>
          <option value='webtoon'>Webtoon</option>
          <option value='novel'>Novel</option>
        </Select>
      </div>
      <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
        {releases.map((val, idx) => (
          <ReleaseCard key={`${val.id_serie}-${idx}`} release={val} />
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
    <li className='relative sm:flex sm:h-48 overflow-hidden bg-light dark:bg-dark border border-light-b dark:border-dark-b rounded shadow-lg'>
      <StarButton
        serie={{
          id: release.id_serie,
          image: release.image,
          link: release.link,
          name: release.name,
        }}
      />
      <div className='min-w-fit bg-slate-300 dark:bg-slate-700/10'>
        <Image
          sources={[
            [
              { src: release.image_avif, type: 'image/avif' },
              { src: release.image, type: 'image/jpg' },
            ],
            [
              { src: release.image_thumb_avif, type: 'image/avif' },
              { src: release.image_thumb, type: 'image/jpg' },
            ],
          ]}
          alt={release.name}
          className='w-full sm:w-32 h-48 object-contain sm:object-cover'
          fallback={
            <div className='w-full sm:w-32 h-48 flex justify-center items-center'>
              <ImageOff className='h-10' />
            </div>
          }
          loading='lazy'
        />
      </div>
      <div className='flex flex-col overflow-hidden p-4'>
        <h3 className='font-bold text-xl sm:max-h-24 max-w-fit line-clamp-3 tracking-tight'>
          <Link
            to={release.link}
            title={release.name}
            className='hover:underline'
          >
            {release.name}
          </Link>
        </h3>
        <h4 className='font-bold text-opacity-75 text-slate-900 dark:text-slate-400 text-sm truncate'>
          {scans}
        </h4>
        <nav className='mt-auto inline-flex flex-wrap h-[2.25rem] overflow-hidden text-sm font-semibold text-gray-700'>
          {release.chapters.map((chap) => (
            <Link
              key={chap.number}
              className='mt-2 mr-2 px-2 py-1 bg-gray-200 rounded-tr-md rounded-b-md hover:bg-gray-300'
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
