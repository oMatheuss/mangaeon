'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, RefreshCwOff, RotateCcw } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface PaginasProps {
  images: string[];
}

export default function InfiniteScrollerView({ images }: PaginasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isFetching,
    isError,
    failureReason,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['chapter_images', images],
    queryFn: async ({ pageParam }) => {
      const url = images;

      const img = new Image();
      const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

      img.referrerPolicy = 'no-referrer';
      img.sizes = '(max-width: 65ch) 100vw, 65ch';
      img.src = url[pageParam];

      return promise;
    },
    initialPageParam: 0,
    getNextPageParam: (_1, _2, last) =>
      last + 1 < images.length ? last + 1 : null,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFetching) return;

    const observer = new IntersectionObserver((entries, _observer) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    const container = containerRef.current!;
    const images = container.querySelectorAll('img');
    const lastImage = images[images.length - 1];
    if (lastImage) observer.observe(lastImage);

    return () => observer.disconnect();
  }, [fetchNextPage, isFetching, data]);

  return (
    <div ref={containerRef} className='mx-auto flex max-w-prose flex-col'>
      {data?.pages.map((img, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={idx}
          sizes='(max-width: 65ch) 100vw, 65ch'
          src={img.src}
          referrerPolicy='no-referrer'
          alt={`Página ${idx + 1}`}
          className='w-full object-contain'
        />
      ))}

      {isFetching ? (
        <div className='my-3 flex flex-col items-center justify-center'>
          <Loader2 className='h-10 w-10 animate-spin' />
          <span>Carregando</span>
        </div>
      ) : isError ? (
        <div className='my-3 flex flex-col items-center justify-center'>
          <span>Falha ao carregar página: {failureReason?.message}</span>
          <div className='flex flex-row space-x-3'>
            <button
              onClick={() => refetch()}
              className='mt-3 flex flex-row items-center rounded-sm border p-2'
            >
              <RotateCcw className='mr-2' />
              Atualizar
            </button>
            <button
              onClick={() => fetchNextPage()}
              className='mt-3 flex flex-row items-center rounded-sm border p-2'
            >
              <RefreshCwOff className='mr-2' />
              Ignorar
            </button>
          </div>
        </div>
      ) : !hasNextPage ? (
        <div className='my-3 flex flex-col items-center justify-center'>
          <span>Você chegou ao final do capítulo!</span>
        </div>
      ) : null}
    </div>
  );
}
