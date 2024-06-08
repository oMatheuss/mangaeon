'use client';

import { Loader2, RefreshCwOff, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface PaginasProps {
  images: string[];
}

enum ImageStatus {
  LOADING,
  ERROR,
  FINISHED,
}

export function Paginas({ images }: PaginasProps) {
  const [status, setStatus] = useState(ImageStatus.LOADING);
  const [cursor, setCursor] = useState(0);

  const handleResolve = (success: boolean, num: number) => {
    if (success) {
      if (cursor < images.length) {
        setCursor(num + 1);
        setStatus(ImageStatus.LOADING);
      } else {
        setStatus(ImageStatus.FINISHED);
      }
    } else {
      setCursor(num - 1);
      setStatus(ImageStatus.ERROR);
    }
  };

  const handleRetry = () => {
    setCursor((c) => c + 1);
    setStatus(ImageStatus.LOADING);
  };

  const handleIgnore = () => {
    const next = cursor + 2;
    if (next < images.length) {
      setStatus(ImageStatus.LOADING);
    } else {
      setStatus(ImageStatus.FINISHED);
    }
    setCursor(next);
  };

  return (
    <div className='mx-auto flex max-w-prose flex-col'>
      {images.slice(0, cursor + 1).map((img, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={idx}
          sizes='(max-width: 65ch) 100vw, 65ch'
          src={img}
          alt={`Página ${idx + 1}`}
          onLoad={() => handleResolve(true, idx)}
          onError={() => handleResolve(false, idx)}
          loading='lazy'
          className='w-full object-contain'
        />
      ))}

      {status === ImageStatus.LOADING ? (
        <div className='my-3 flex flex-col items-center justify-center'>
          <Loader2 className='h-10 w-10 animate-spin' />
          <span>Carregando</span>
        </div>
      ) : status === ImageStatus.ERROR ? (
        <div className='my-3 flex flex-col items-center justify-center'>
          <span>Falha ao carregar página {cursor + 1}</span>
          <div className='flex flex-row space-x-3'>
            <button
              onClick={handleRetry}
              className='mt-3 flex flex-row items-center rounded-sm border p-2'
            >
              <RotateCcw className='mr-2' />
              Atualizar
            </button>
            <button
              onClick={handleIgnore}
              className='mt-3 flex flex-row items-center rounded-sm border p-2'
            >
              <RefreshCwOff className='mr-2' />
              Ignorar
            </button>
          </div>
        </div>
      ) : status === ImageStatus.FINISHED ? (
        <div className='my-3 flex flex-col items-center justify-center'>
          <span>Você chegou ao final do capítulo!</span>
        </div>
      ) : null}
    </div>
  );
}
