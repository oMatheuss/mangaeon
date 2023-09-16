'use client';

import { useEffect, useRef } from 'react';

interface FeaturedScrollProps {
  children: React.ReactNode;
}

export const FeaturedScroll = ({ children }: FeaturedScrollProps) => {
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
  }, [children]);

  return (
    <section ref={wrapperRef} className='featured-effect'>
      <ul
        ref={containerRef}
        className='w-full h-64 flex snap-x snap-mandatory overflow-x-auto bg-inherit border border-base-content/20 rounded'
      >
        {children}
      </ul>
    </section>
  );
};
