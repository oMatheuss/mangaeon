import type { Manga } from '@/types/manga';
import type { MangaToSave } from './saved';

export interface ErrorResponse {
  status: number;
  statusText: string;
}

export const toErrorReponse = (res: Response): ErrorResponse => {
  return {
    status: res.status,
    statusText: res.statusText,
  };
};

export const mapUntil = <T, S>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => S,
  condFn: (value: T, index: number, array: T[]) => boolean
) => {
  const result: S[] = [];
  for (let i = 0; i < arr.length; ++i) {
    result.push(callback(arr[i], i, arr));
    if (condFn(arr[i], i, arr)) break;
  }
  return result;
};

export const fromMangaToSaved = (manga: Manga) => {
  return {
    artist: manga.artist,
    author: manga.author,
    coverUri: manga.cover,
    mangaId: manga.id,
    tags: manga.tags,
    title: manga.title,
  } as MangaToSave;
};
