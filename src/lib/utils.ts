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

export function isUUID(uuid: string) {
  // https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid

  const regex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return regex.test(uuid);
}

export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function intoArray<T>(value?: T | T[]) {
  if (typeof value === 'undefined') return [];
  else if (Array.isArray(value)) return value;
  else return [value];
}
