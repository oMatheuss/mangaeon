'use client';

import { type Liked, useLiked } from '@/lib/client/liked';
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
      className='group absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-br text-yellow-600'
      onClick={handleClick}
    >
      <Star
        aria-label='Favoritar'
        fill={isActive ? 'currentColor' : 'transparent'}
        className='h-5 w-5 transition-all duration-300 ease-out group-aria-checked:rotate-[72deg] group-aria-checked:scale-110'
      />
    </button>
  );
};
