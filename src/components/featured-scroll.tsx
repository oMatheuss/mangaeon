import { Featured } from '@/types/featured';
import { Link } from 'react-router-dom';
import { type ErrorResponse, toErrorReponse } from '@/lib/utils';
import type { FeaturedResponse } from '@/types/featured';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

const fetchFeatured = async (): Promise<FeaturedResponse> => {
  const res = await fetch('/api/home/getFeaturedSeries.json');
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

const ONE_HOUR = 1000 * 60 * 60;
const THIRTY_MIN = 1000 * 60 * 30;

export const FeaturedScroll = () => {
  const featuredQuery = useQuery<FeaturedResponse, ErrorResponse>({
    queryKey: ['featured'],
    queryFn: fetchFeatured,
    cacheTime: ONE_HOUR,
    staleTime: THIRTY_MIN,
  });

  const featured = featuredQuery.data?.featured ?? [];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLUListElement>(null);

  const observerCallback: IntersectionObserverCallback = (entries) => {
    const firstElement = entries[0].target as HTMLDivElement;
    const targetColor = firstElement.style.backgroundColor;

    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty('--featured-color', targetColor);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 1.0,
    });

    if (containerRef.current) {
      containerRef.current.childNodes.forEach((child) => {
        observer.observe(child as HTMLDivElement);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [featured]);

  return (
    <section ref={wrapperRef} className='featured-effect'>
      <ul
        ref={containerRef}
        className='w-full h-64 flex snap-x snap-mandatory overflow-x-auto bg-inherit rounded'
      >
        {featured?.map((val) => (
          <FeaturedCard key={val.id_chapter} item={val} />
        ))}
      </ul>
    </section>
  );
};

interface FeaturedCardProps {
  item: Featured;
}

const FeaturedCard = ({ item }: FeaturedCardProps) => {
  return (
    <li
      className='snap-center relative h-full w-full shrink-0 text-slate-100 overflow-hidden'
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
        backgroundColor: `#${item.hex_color || 'acacac'}`,
      }}
    >
      <Link
        to={item.link}
        className='min-w-fit select-text focus:outline outline-1 outline-indigo-600 -outline-offset-1'
      >
        <img
          className='h-full w-full object-contain object-bottom'
          src={item.featured_image}
          alt={item.series_name}
        />
      </Link>
      <div className='absolute top-0 flex flex-col px-6 py-4 pointer-events-none'>
        <Link className='font-bold text-xl hover:underline' to={item.link}>
          {item.series_name}
        </Link>
        <span className='text-sm'>Capítulo {item.chapter.number}</span>
        <span className='text-sm'>
          {new Date(item.date).toLocaleDateString()}
        </span>
      </div>
    </li>
  );
};
