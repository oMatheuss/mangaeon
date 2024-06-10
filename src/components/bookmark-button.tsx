'use client';

import {
  useRemoveMangaMutation,
  useSaveMangaMutation,
  useSavedManga,
  type MangaToSave,
} from '@/lib/client/saved';
import { BookmarkIcon } from 'lucide-react';

interface StarButtonProps {
  manga: MangaToSave;
}

export function BookmarkButton({ manga }: StarButtonProps) {
  const save = useSaveMangaMutation();
  const remove = useRemoveMangaMutation();

  const { data } = useSavedManga(manga.mangaId);
  const isActive = data !== null;

  const handleClick = () =>
    !isActive ? save.mutate(manga) : remove.mutate(manga.mangaId);

  const isPending = save.isPending || remove.isPending;

  return (
    <button
      role='checkbox'
      aria-checked={isActive ? 'true' : isPending ? 'mixed' : 'false'}
      className='group absolute left-0 top-0 p-2'
      onClick={handleClick}
      disabled={isPending}
      aria-label='Favoritar'
    >
      <div className='rounded-badge bg-primary/75 p-1 text-primary-content opacity-80 transition-opacity group-enabled:group-hover:opacity-100 group-enabled:group-active:opacity-60 group-disabled:opacity-60'>
        <BookmarkIcon
          aria-hidden={true}
          className='size-5 group-aria-checked:fill-current'
        />
      </div>
    </button>
  );
}
