import { Featured } from '@/types/featured';
import { Link } from 'react-router-dom';

interface FeaturedScrollProps {
  featured: Featured[];
}

export const FeaturedScroll = ({ featured }: FeaturedScrollProps) => {
  return (
    <div className='relative w-full flex gap-12 snap-x snap-mandatory overflow-x-auto p-6 bg-slate-100 dark:bg-slate-900 rounded'>
      {featured?.map((val) => (
        <div key={val.id_serie} className='snap-center shrink-0'>
          <div
            className='relative h-56 shrink-0 w-[calc(100vw-3rem)] sm:w-96 text-slate-100 rounded overflow-hidden shadow-lg'
            style={{ backgroundColor: `#${val.hex_color || 'acacac'}` }}
          >
            <Link
              to={val.link}
              className='select-text focus:outline outline-1 outline-indigo-600 -outline-offset-1'
            >
              <img
                className='h-full object-contain object-bottom mx-auto'
                src={val.featured_image}
                alt={val.series_name}
              />
            </Link>
            <div className='absolute top-0 flex flex-col px-6 py-4 pointer-events-none'>
              <Link className='font-bold text-xl hover:underline' to={val.link}>
                {val.series_name}
              </Link>
              <span className='text-sm'>Capítulo {val.chapter.number}</span>
              <span className='text-sm'>
                {new Date(val.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
