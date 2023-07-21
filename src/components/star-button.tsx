import { type Liked, useLiked } from '@/lib/liked';
import { Star } from 'lucide-react';

interface HeartButtonProps {
  serie: Liked;
}

export const StarButton = ({ serie }: HeartButtonProps) => {
  const liked = useLiked();

  const isActive = liked.exist(serie.id);

  const handleClick = () => {
    if (isActive) {
      liked.del(serie.id);
    } else {
      liked.add(serie);
    }
  };

  return (
    <button
      role='checkbox'
      aria-checked={isActive}
      className='absolute top-0 left-0 inline-flex items-center justify-center w-10 h-10 text-yellow-600 rounded-br group'
      onClick={handleClick}
    >
      <span className='sr-only'>Favoritar</span>
      <Star
        fill={isActive ? 'currentColor' : 'transparent'}
        className='w-5 h-5 transition-all ease-out duration-300 group-aria-checked:scale-110 group-aria-checked:rotate-[72deg]'
      />
    </button>
  );
};
