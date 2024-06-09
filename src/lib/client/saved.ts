'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';

export interface SavedManga {
  mangaId: string;
  title: string;
  author: string;
  artist: string;
  tags: string[];
  status: 'Reading' | 'Completed' | 'On-Hold' | 'Dropped' | 'Plan-To-Read';
  coverImage: Blob;
  chaptersRead: string[];
  includedAt: Date;
}

const store = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: 'MangaEonDB',
  version: 1.0,
  storeName: 'saved_mangas',
});

export const SavedMangas = {
  async findAll() {
    return this.filter(() => true);
  },

  async findById(mangaId: string) {
    return await store.getItem<SavedManga>(mangaId);
  },

  async save(manga: SavedManga) {
    return await store.setItem(manga.mangaId, manga);
  },

  async remove(mangaId: string) {
    await store.removeItem(mangaId);
  },

  async filter(predicate: (value: SavedManga) => boolean) {
    const result: SavedManga[] = [];
    await store.iterate<SavedManga, any>((value) => {
      if (predicate(value)) result.push(value);
    });
    result.sort((a, b) => a.includedAt.getTime() - b.includedAt.getTime());
    return result;
  },
};

export function useSavedManga(mangaId: string) {
  return useQuery({
    queryKey: ['local:manga', mangaId],
    queryFn: () => SavedMangas.findById(mangaId),
  });
}

export function useMangaList() {
  return useQuery({
    queryKey: ['local:manga'],
    queryFn: () => SavedMangas.findAll(),
  });
}

export interface MangaToSave
  extends Omit<SavedManga, 'status' | 'chaptersRead' | 'coverImage'> {
  coverUri: string;
}

export function useSaveMangaMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['local:manga'],
    mutationFn: async (manga: MangaToSave) => {
      const { coverUri, ...rest } = manga;

      const secure = coverUri.includes('https') ? 'secure' : 'insecure';
      const source = coverUri.replace(/https?:\/\/(.*)/, '$1');
      const targetUrl = `/mangadex/${secure}/${source}`;

      const coverImage = await fetch(targetUrl, {
        referrerPolicy: 'no-referrer',
      }).then((x) => x.blob());

      return await SavedMangas.save({
        status: 'Plan-To-Read',
        chaptersRead: [],
        coverImage,
        ...rest,
      });
    },
    onSuccess: ({ mangaId }) =>
      qc.invalidateQueries({ queryKey: ['local:manga', mangaId] }),
  });
}

export function useRemoveMangaMutation(invalidateAll: boolean = false) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['local:manga'],
    mutationFn: SavedMangas.remove,
    onSuccess: (_, mangaId) => {
      const queryKey = invalidateAll
        ? ['local:manga']
        : ['local:manga', mangaId];
      qc.invalidateQueries({ queryKey });
    },
  });
}
