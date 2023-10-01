'use client';

import { mapUntil } from '@/lib/client/utils';
import { Loader2, RefreshCwOff, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PaginasProps {
  images: string[];
}

enum ImageStatus {
  OK,
  ERROR,
  NOT_FETCHED,
  REFETCH,
  SKIPED,
}

export const Paginas = ({ images }: PaginasProps) => {
  const [imagesStatus, setImagesStatus] = useState<ImageStatus[]>([]);

  useEffect(() => {
    setImagesStatus(
      Array<ImageStatus>(images.length).fill(ImageStatus.NOT_FETCHED)
    );
  }, [images]);

  const handleImgResolve = (success: boolean, page: number) => {
    const idx = page - 1;
    setImagesStatus((status) => {
      const newArr = [...status];
      if (success) {
        newArr[idx] = ImageStatus.OK;
      } else if (
        status[idx + 1] !== undefined &&
        status[idx + 1] !== ImageStatus.NOT_FETCHED
      ) {
        newArr[idx] = ImageStatus.SKIPED;
      } else {
        newArr[idx] = ImageStatus.ERROR;
      }
      return newArr;
    });
  };

  const handleRetry = (idx: number) => {
    setImagesStatus((status) => {
      const newArr = [...status];
      newArr[idx] = ImageStatus.REFETCH;
      return newArr;
    });
  };

  const handleSkip = (idx: number) => {
    setImagesStatus((status) => {
      const newArr = [...status];
      newArr[idx] = ImageStatus.SKIPED;
      return newArr;
    });
  };

  return (
    <div className='max-w-prose mx-auto flex flex-col'>
      {mapUntil(
        imagesStatus,
        (status, idx) => {
          if (
            status === ImageStatus.OK ||
            status === ImageStatus.NOT_FETCHED ||
            status === ImageStatus.REFETCH
          ) {
            return (
              <MangaPage
                key={idx}
                img={images[idx]}
                page={idx + 1}
                onResolve={handleImgResolve}
              />
            );
          } else {
            return (
              <div
                key={idx}
                className='my-3 flex flex-col justify-center items-center'
              >
                <span>Falha ao carregar página {idx + 1}</span>
                <div className='flex flex-row space-x-3'>
                  <button
                    onClick={() => handleRetry(idx)}
                    className='flex flex-row items-center p-2 mt-3 border rounded-sm'
                  >
                    <RotateCcw className='mr-2' />
                    Atualizar
                  </button>
                  <button
                    onClick={() => handleSkip(idx)}
                    className='flex flex-row items-center p-2 mt-3 border rounded-sm'
                  >
                    <RefreshCwOff className='mr-2' />
                    Ignorar
                  </button>
                </div>
              </div>
            );
          }
        },
        (status, idx, arr) =>
          status === ImageStatus.ERROR ||
          status === ImageStatus.NOT_FETCHED ||
          (status === ImageStatus.REFETCH &&
            arr[idx + 1] !== undefined &&
            arr[idx + 1] === ImageStatus.NOT_FETCHED)
      )}
      {imagesStatus.length > 0 &&
        imagesStatus.every((status) => status !== ImageStatus.NOT_FETCHED) && (
          <div className='my-3 flex flex-col justify-center items-center'>
            <span>Você chegou ao final do capítulo!</span>
          </div>
        )}
    </div>
  );
};

interface MangaPageProps {
  img: string;
  page: number;
  onResolve: (success: boolean, num: number) => void;
}

type Status =
  | {
      resolved: false;
      success: null;
    }
  | {
      resolved: true;
      success: boolean;
    };

export const MangaPage = ({ img, page, onResolve }: MangaPageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const [status, setStatus] = useState<Status>({
    resolved: false,
    success: null,
  });

  const handleLoad = () => setStatus({ resolved: true, success: true });
  const handleError = () => setStatus({ resolved: true, success: false });

  useEffect(() => {
    if (!imgRef.current) return;

    if (imgRef.current.complete) {
      setStatus({ resolved: true, success: imgRef.current.naturalHeight > 0 });
    }
  }, []);

  useEffect(() => {
    if (status.resolved) onResolve(status.success, page);
  }, [status, page]);

  return (
    <>
      <img
        ref={imgRef}
        loading='lazy'
        src={img}
        alt={`Página ${page}`}
        className='w-full object-contain'
        onLoad={handleLoad}
        onError={handleError}
      />
      {!status.resolved && (
        <div className='my-3 flex flex-col justify-center items-center'>
          <Loader2 className='h-10 w-10 animate-spin' />
          <span>Carregando</span>
        </div>
      )}
    </>
  );
};
