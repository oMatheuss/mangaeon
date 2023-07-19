import { Featured } from '@/types/featured';
import { Link } from 'react-router-dom';

interface FeaturedScrollProps {
  featured: Featured[];
}

export const FeaturedScroll = ({ featured }: FeaturedScrollProps) => {
  return (
    <div className='relative w-full flex gap-12 snap-x snap-mandatory overflow-x-auto py-12 bg-slate-100 dark:bg-slate-900 rounded'>
      <div className='snap-none shrink-0'>
        <div className='shrink-0 w-1 sm:w-48'></div>
      </div>
      {featured?.map((val) => (
        <div key={val.id_serie} className='snap-center shrink-0'>
          <div className='shrink-0 w-[calc(100vw-3rem)] sm:w-96 bg-slate-200 dark:bg-slate-950 rounded overflow-hidden shadow-lg'>
            <Link
              to={val.link}
              className='select-text focus:outline outline-1 outline-indigo-600 -outline-offset-1'
            >
              <img
                className='w-full bg-center'
                src={val.featured_image}
                alt={val.series_name}
              />
            </Link>
            <div className='px-6 py-4'>
              <Link className='font-bold text-xl hover:underline' to={val.link}>
                {val.series_name}
              </Link>
            </div>
            <div className='px-6 pt-4 pb-2 select-none'>
              <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                #Capítulo {val.chapter.number}
              </span>
              <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                #{new Date(val.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className='snap-none shrink-0'>
        <div className='shrink-0 w-4 sm:w-48'></div>
      </div>
    </div>
  );
};
