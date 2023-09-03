'use client';

import { Featured } from '@/types/featured';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface FeaturedScrollProps {
  featured: Featured[];
}

export const FeaturedScroll = ({ featured }: FeaturedScrollProps) => {
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
  const link = `/ler/${item.chapter.id_release}`;

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
        href={link}
        className='min-w-fit select-text focus:outline outline-1 outline-indigo-600 -outline-offset-1'
      >
        <img
          className='h-full w-full object-contain object-bottom'
          src={item.featured_image}
          alt={item.series_name}
        />
      </Link>
      <div className='absolute top-0 flex flex-col px-6 py-4 pointer-events-none'>
        <Link className='font-bold text-xl hover:underline' href={link}>
          {item.series_name}
        </Link>
        <span className='text-sm'>Capítulo {item.chapter.number}</span>
        <span className='text-sm'>
          {new Date(item.date).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </li>
  );
};
