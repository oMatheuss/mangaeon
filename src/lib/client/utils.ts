import type { Manga } from '@/types/manga';
import type { MangaToSave } from './saved';

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
