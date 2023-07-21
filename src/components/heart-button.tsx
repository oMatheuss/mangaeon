import { useLiked } from '@/lib/liked';
import { Release } from '@/types/releases';
import { Heart } from 'lucide-react';

interface HeartButtonProps {
  serie: Release;
}

export const HeartButton = ({ serie }: HeartButtonProps) => {
  const liked = useLiked();

  const isActive = liked.exist(serie.id_serie);

  const handleClick = () => {
    if (isActive) {
      liked.del(serie.id_serie);
    } else {
      liked.add({
        id: serie.id_serie,
        image: serie.image,
        link: serie.link,
        name: serie.name,
      });
    }
  };

  return (
    <button
      className='absolute top-0 left-0 inline-flex items-center justify-center w-10 h-10 text-red-600 rounded-br'
      onClick={handleClick}
    >
      <span className='sr-only'>Favoritar</span>
      <Heart
        fill={isActive ? 'currentColor' : 'transparent'}
        className='w-5 h-5'
      />
    </button>
  );
};
