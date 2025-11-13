'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PaginasProps {
  images: string[];
}

export function PageByPageView({ images }: PaginasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [actualPage, setActualPage] = useState(0);

  const { data, isFetching, isError, failureReason, refetch, fetchNextPage } =
    useInfiniteQuery({
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
      retry: false,
    });

  const total = images.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas === null || container === null || !data) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('ERROR: 2d context not available');
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (data.pages[actualPage] instanceof HTMLImageElement) {
      const img = data.pages[actualPage];
      const aspect = img.naturalWidth / img.naturalHeight;

      // 4,096 x 4,096 is the maximum safe area
      const customWidth = Math.max(
        Math.min(img.naturalWidth, 4096),
        Math.min(container.clientWidth, 4096)
      );
      const customHeight = Math.min(img.naturalHeight, 4096);

      // update canvas size
      canvas.height = customHeight;
      canvas.width = customWidth;

      // keep aspect ratio
      let customImgWidth = Math.floor(customHeight * aspect);
      let customImgHeight = customHeight;

      // center image
      const xPos = Math.floor((customWidth - customImgWidth) / 2);

      ctx.drawImage(img, xPos, 0, customImgWidth, customImgHeight);
    }

    if (actualPage === data.pages.length - 1 && !isFetching) {
      fetchNextPage({ cancelRefetch: false });
    }
  }, [actualPage, data, isFetching, fetchNextPage, total]);

  return (
    <div ref={containerRef} className='flex w-full max-w-prose flex-col'>
      <p>Página atual: {actualPage + 1}</p>
      <canvas
        ref={canvasRef}
        className='h-full w-full'
        aria-label='página atual'
      />

      <div className='mt-3 flex flex-wrap gap-2'>
        <Button
          onClick={() => setActualPage(actualPage - 1)}
          disabled={actualPage === 0}
          aria-label='página anterior'
        >
          <ArrowLeftIcon aria-hidden={true} />
        </Button>
        <Button
          onClick={() => setActualPage(actualPage + 1)}
          aria-label='proxima página'
          disabled={
            (isFetching && actualPage === (data?.pages.length ?? 1) - 1) ||
            actualPage === total - 1
          }
        >
          <ArrowRightIcon aria-hidden={true} />
        </Button>
        {isFetching && !isError && (
          <div className='flex h-9 items-center justify-center'>
            <Loader2 className='mr-2 animate-spin' />
            <span>Carregando</span>
          </div>
        )}
        {actualPage === total - 1 && (
          <div className='justify-cente flex h-9 items-center'>
            <span>Você chegou ao final do capítulo!</span>
          </div>
        )}
        {isError && (
          <>
            <Button onClick={() => refetch()}>
              <RotateCcw aria-hidden={true} />
            </Button>
            <div className='justify-cente flex h-9 items-center'>
              <span>Falha ao carregar página: {failureReason?.message}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Button({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className='rounded-field bg-primary text-primary-content hover:bg-primary/80 active:bg-primary/60 disabled:bg-primary/50 flex h-9 items-center p-2'
      {...rest}
    >
      {children}
    </button>
  );
}
