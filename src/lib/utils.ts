import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Manga } from '@/types/manga';
import type { MangaToSave } from '@/lib/client/saved';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileExtension(mimeType: string) {
  const _mime = mimeType.toLowerCase();
  if (_mime.includes('jpg') || _mime.includes('jpeg')) {
    return 'jpg';
  } else if (_mime.includes('png')) {
    return 'pnj';
  } else if (_mime.includes('webp')) {
    return 'webp';
  } else if (_mime.includes('avif')) {
    return 'avif';
  } else {
    return '';
  }
}

export function fromMangaToSaved(manga: Manga) {
  return {
    artist: manga.artist,
    author: manga.author,
    coverUri: manga.cover,
    mangaId: manga.id,
    tags: manga.tags,
    title: manga.title,
  } as MangaToSave;
}
