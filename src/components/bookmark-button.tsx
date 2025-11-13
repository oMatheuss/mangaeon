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
  const isActive = !!data;

  const handleClick = () =>
    !isActive ? save.mutate(manga) : remove.mutate(manga.mangaId);

  const isPending = save.isPending || remove.isPending;

  return (
    <button
      role='checkbox'
      aria-checked={isActive ? 'true' : isPending ? 'mixed' : 'false'}
      className='group absolute top-0 left-0 p-2'
      onClick={handleClick}
      disabled={isPending}
      aria-label='Favoritar'
    >
      <div className='rounded-selector bg-primary/75 text-primary-content p-1 opacity-80 transition-opacity group-hover:group-enabled:opacity-100 group-active:group-enabled:opacity-60 group-disabled:opacity-60'>
        <BookmarkIcon
          aria-hidden={true}
          className='size-5 group-aria-checked:fill-current'
        />
      </div>
    </button>
  );
}
