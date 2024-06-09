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

export function useSavedManga(mangaId: string) {
  return useQuery({
    queryKey: ['local:manga', mangaId],
    queryFn: () => store.getItem<SavedManga>(mangaId),
  });
}

export function useMangaList() {
  return useQuery({
    queryKey: ['local:manga'],
    queryFn: async () => {
      const result: SavedManga[] = [];
      await store.iterate<SavedManga, any>((value) => {
        result.push(value);
      });
      result.sort((a, b) => a.includedAt.getTime() - b.includedAt.getTime());
      return result;
    },
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

      return await store.setItem(rest.mangaId, {
        ...rest,
        status: 'Plan-To-Read',
        chaptersRead: [],
        coverImage,
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
    mutationFn: (mangaId: string) => store.removeItem(mangaId),
    onSuccess: (_, mangaId) => {
      const queryKey = invalidateAll
        ? ['local:manga']
        : ['local:manga', mangaId];
      qc.invalidateQueries({ queryKey });
    },
  });
}

export function useExportSavedMangasToCsv() {
  return useMutation({
    mutationKey: ['local:manga'],
    mutationFn: async () => {
      const lines: string[] = [];

      const header = 'Id,Título,Autor,Artista,Incluído em';
      lines.push(header);

      const buildLine = (manga: SavedManga) => {
        const { mangaId, title, author, artist, includedAt } = manga;
        return `${mangaId},"${title}","${author}","${artist}",${includedAt.toISOString()}`;
      };

      await store.iterate<SavedManga, any>((value) => {
        lines.push(buildLine(value));
      });

      return lines.join('\n');
    },
  });
}
