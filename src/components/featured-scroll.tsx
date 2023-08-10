import { Featured } from '@/types/featured';
import { Link } from 'react-router-dom';

interface FeaturedScrollProps {
  featured: Featured[];
}

export const FeaturedScroll = ({ featured }: FeaturedScrollProps) => {
  return (
    <div className='relative w-full h-64 flex snap-x snap-mandatory overflow-x-auto bg-light dark:bg-dark border border-light-b dark:border-dark-b rounded shadow'>
      {featured?.map((val) => (
        <div key={val.id_serie} className='w-full snap-center shrink-0'>
          <div
            className='relative h-full shrink-0 w-full text-slate-100 overflow-hidden'
            style={{
              backgroundColor: `#${val.hex_color || 'acacac'}`,
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
            }}
          >
            <Link
              to={val.link}
              className='min-w-fit select-text focus:outline outline-1 outline-indigo-600 -outline-offset-1'
            >
              <img
                className='h-full w-full object-contain object-bottom'
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
