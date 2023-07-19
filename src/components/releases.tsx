import { Release, Scan } from '@/types/releases';
import { Link } from 'react-router-dom';

interface ReleasesProps {
  releases: Release[];
}

export const Releases = ({ releases }: ReleasesProps) => {
  return (
    <div className='flex flex-col space-y-7'>
      {releases.map((val) => (
        <div
          key={val.id_serie}
          className='w-full sm:flex sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 rounded'
        >
          <Link
            to={val.link}
            className='focus:outline outline-indigo-600 outline-1 -outline-offset-1'
          >
            <picture>
              <source srcSet={val.image_avif} type='image/avif' />
              <img
                src={val.image}
                alt={val.name}
                className='w-full border-b-2 sm:border-none sm:w-auto h-48 flex-none object-center object-contain'
              />
            </picture>
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
            <div className='select-none'>
              {val.chapters.map((chap) => (
                <Link
                  key={chap.number}
                  className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mt-2 hover:bg-gray-300'
                  to={chap.url}
                >
                  #Capítulo {chap.number}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
