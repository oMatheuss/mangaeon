import { Image } from '@/types/images';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaginasProps {
  images: Image[];
}

export const Paginas = ({ images }: PaginasProps) => {
  const [imagesToView, setImagesToView] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!images || images.length === 0) return;
    let index = 0;

    const onLoad = () => {
      if (++index < images.length) {
        setImagesToView((x) => [...x, template(images[index])]);
      }
    };

    const template = (val: Image) => {
      return (
        <picture key={index} onLoad={onLoad}>
          <source srcSet={val.avif} type='image/avif' />
          <img
            loading='lazy'
            src={val.legacy}
            alt={`página ${index}`}
            className='w-full object-contain'
          />
        </picture>
      );
    };

    setImagesToView([template(images[index])]);
  }, [images]);

  return (
    <div className='max-w-prose mx-auto flex flex-col'>
      {imagesToView}
      {(images.length !== imagesToView.length || images.length === 0) && (
        <div className='my-3 flex flex-col justify-center items-center'>
          <Loader2 className='h-10 w-10 animate-spin' />
          <span>Carregando</span>
        </div>
      )}
      {images.length > 0 && images.length === imagesToView.length && (
        <div className='my-3 flex flex-col justify-center items-center'>
          <span>Você chegou ao final do capitulo!</span>
        </div>
      )}
    </div>
  );
};
