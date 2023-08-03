import { Release, Scan } from '@/types/releases';
import { Link } from 'react-router-dom';
import { Image } from '@/components/image';
import { StarButton } from '@/components/star-button';
import { ImageOff } from 'lucide-react';

interface ReleasesProps {
  releases: Release[];
}

export const Releases = ({ releases }: ReleasesProps) => {
  return (
    <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
      {releases.map((val) => (
        <ReleaseCard key={val.id_serie} release={val} />
      ))}
    </ul>
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
    <li className='relative w-full sm:flex sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded shadow-lg'>
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
