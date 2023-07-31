import { mapUntil } from '@/lib/utils';
import { Image } from '@/types/images';
import { Loader2, RefreshCwOff, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PaginasProps {
  images: Image[];
}

type ImageStatus = {
  status: 'OK' | 'ERROR' | 'NOT_FETCHED' | 'REFETCH' | 'SKIPED';
};

export const Paginas = ({ images }: PaginasProps) => {
  const [imagesStatus, setImagesStatus] = useState<ImageStatus[]>([]);

  useEffect(() => {
    setImagesStatus(images.map(() => ({ status: 'NOT_FETCHED' })));
  }, [images]);

  const handleImgResolve = (success: boolean, page: number) => {
    const idx = page - 1;
    setImagesStatus((x) => {
      let newArr = [...x];
      if (success) {
        x[idx].status = 'OK';
      } else if (
        x[idx + 1] !== undefined &&
        x[idx + 1].status !== 'NOT_FETCHED'
      ) {
        x[idx].status = 'SKIPED';
      } else {
        x[idx].status = 'ERROR';
      }
      return newArr;
    });
  };

  const handleRetry = (idx: number) => {
    setImagesStatus((x) => {
      let newArr = [...x];
      newArr[idx].status = 'REFETCH';
      return newArr;
    });
  };

  const handleSkip = (idx: number) => {
    setImagesStatus((x) => {
      let newArr = [...x];
      newArr[idx].status = 'SKIPED';
      return newArr;
    });
  };

  return (
    <div className='max-w-prose mx-auto flex flex-col'>
      {mapUntil(
        imagesStatus,
        (x, idx) => {
          if (
            x.status === 'OK' ||
            x.status === 'NOT_FETCHED' ||
            x.status === 'REFETCH'
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
        (x, idx, arr) =>
          x.status === 'ERROR' ||
          x.status === 'NOT_FETCHED' ||
          (x.status === 'REFETCH' &&
            arr[idx + 1] !== undefined &&
            arr[idx + 1].status === 'NOT_FETCHED')
      )}
      {imagesStatus.length > 0 &&
        imagesStatus.every((x) => x.status !== 'NOT_FETCHED') && (
          <div className='my-3 flex flex-col justify-center items-center'>
            <span>Você chegou ao final do capítulo!</span>
          </div>
        )}
    </div>
  );
};

interface MangaPageProps {
  img: Image;
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
      {!status.resolved && (
        <div className='my-3 flex flex-col justify-center items-center'>
          <Loader2 className='h-10 w-10 animate-spin' />
          <span>Carregando</span>
        </div>
      )}
      <picture onLoad={handleLoad} onError={handleError}>
        <source srcSet={img.avif} type='image/avif' />
        <img
          ref={imgRef}
          loading='lazy'
          src={img.legacy}
          alt={`Página ${page}`}
          className='w-full object-contain'
        />
      </picture>
    </>
  );
};
