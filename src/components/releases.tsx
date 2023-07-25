import { Release, Scan } from '@/types/releases';
import { Link } from 'react-router-dom';
import { Image } from '@/components/image';
import { StarButton } from './star-button';
import { ImageOff } from 'lucide-react';

interface ReleasesProps {
  releases: Release[];
}

export const Releases = ({ releases }: ReleasesProps) => {
  return (
    <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
      {releases.map((val) => (
        <li
          key={val.id_serie}
          className='relative w-full sm:flex sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 rounded shadow-lg'
        >
          <StarButton
            serie={{
              id: val.id_serie,
              image: val.image,
              link: val.link,
              name: val.name,
            }}
          />
          <Link
            to={val.link}
            className='min-w-fit focus:outline outline-indigo-600 outline-1 -outline-offset-1'
          >
            <Image
              source={[val.image_avif, 'image/avif']}
              src={val.image}
              alt={val.name}
              className='w-full sm:w-32 h-48 border-b-2 sm:border-none object-contain sm:object-cover'
            >
              <div className='bg-slate-300 dark:bg-slate-700/10 w-full sm:w-32 h-48 flex justify-center items-center'>
                <ImageOff className='h-10' />
              </div>
            </Image>
          </Link>
          <div className='p-4 flex flex-col justify-between leading-normal text-center sm:text-left'>
            <h3 className='font-bold text-xl'>
              <Link to={val.link} className='hover:underline'>
                {val.name}
              </Link>
            </h3>
            <h4 className='font-light text-current text-opacity-25 text-sm'>
              {val.chapters
                .flatMap((x) => Object.entries(x.scanlators))
                .flatMap((x) => x[1])
                .reduce((prev, curr) => {
                  return (
                    prev.findIndex(
                      (x) => x.id_scanlator === curr.id_scanlator
                    ) < 0 && prev.push(curr),
                    prev
                  );
                }, [] as Scan[])
                .map((x) => x.name)
                .join(', ')}
            </h4>
            <nav className='select-none'>
              {val.chapters.map((chap) => (
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
      ))}
    </ul>
  );
};
