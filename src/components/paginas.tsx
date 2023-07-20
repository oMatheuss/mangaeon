import { Image } from '@/types/images';

interface PaginasProps {
  images: Image[];
}

export const Paginas = ({ images }: PaginasProps) => {
  return (
    <div className='max-w-prose mx-auto flex flex-col space-y-0'>
      {images.map((val, index) => (
        <picture key={index}>
          <source srcSet={val.avif} type='image/avif' />
          <img
            src={val.legacy}
            alt={`página ${index}`}
            className='w-full object-contain'
          />
        </picture>
      ))}
    </div>
  );
};
