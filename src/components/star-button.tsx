'use client';

import {
  useRemoveMangaMutation,
  useSaveMangaMutation,
  useSavedManga,
  type MangaToSave,
} from '@/lib/client/saved';
import { Star } from 'lucide-react';

interface StarButtonProps {
  manga: MangaToSave;
}

export function StarButton({ manga }: StarButtonProps) {
  const save = useSaveMangaMutation();
  const remove = useRemoveMangaMutation();

  const { data } = useSavedManga(manga.mangaId);
  const isActive = data !== null;

  const handleClick = () =>
    !isActive ? save.mutate(manga) : remove.mutate(manga.mangaId);

  return (
    <button
      role='checkbox'
      aria-checked={isActive}
      className='group absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-br text-yellow-600'
      onClick={handleClick}
      disabled={save.isPending || remove.isPending}
    >
      <Star
        aria-label='Favoritar'
        fill={isActive ? 'currentColor' : 'transparent'}
        className='h-5 w-5 transition-all duration-300 ease-out group-aria-checked:rotate-[72deg] group-aria-checked:scale-110'
      />
    </button>
  );
}
