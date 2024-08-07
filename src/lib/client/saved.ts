'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Dexie, { type EntityTable } from 'dexie';

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

const DB_NAME = 'MangaEonDB';

const TB_OLD_MANGAS = 'saved_mangas';
const TB_MANGAS = 'mangas';

type DbType = Dexie & {
  mangas: EntityTable<SavedManga, 'mangaId'>;
};

let db: DbType;

if (typeof window !== 'undefined') {
  db = new Dexie(DB_NAME) as DbType;

  db.version(3)
    .stores({
      mangas:
        'mangaId,title,author,artist,tags,status,coverImage,chaptersRead,includedAt',
    })
    .upgrade(async (trans) => {
      if (trans.db.backendDB().objectStoreNames.contains(TB_OLD_MANGAS)) {
        const data: SavedManga[] = await trans.table(TB_OLD_MANGAS).toArray();
        await trans.table(TB_MANGAS).bulkAdd(data);
        await trans.table(TB_OLD_MANGAS).clear();
      }
    });
}

export function useSavedManga(mangaId: string) {
  return useQuery({
    queryKey: ['local:manga', mangaId],
    queryFn: async () => {
      const result = await db.table<SavedManga>(TB_MANGAS).get(mangaId);
      return result ?? null;
    },
  });
}

export function useMangaList() {
  return useQuery({
    queryKey: ['local:manga'],
    queryFn: async () => {
      const result = await db.table<SavedManga>(TB_MANGAS).toArray();
      result.sort((a, b) => a.includedAt.getTime() - b.includedAt.getTime());
      return result;
    },
  });
}

export interface MangaToSave
  extends Omit<
    SavedManga,
    'status' | 'chaptersRead' | 'coverImage' | 'includedAt'
  > {
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

      const toSave = {
        ...rest,
        status: 'Plan-To-Read' as const,
        chaptersRead: [],
        coverImage,
        includedAt: new Date(),
      };
      await db.table<SavedManga>(TB_MANGAS).put(toSave, manga.mangaId);

      return toSave;
    },
    onSuccess: ({ mangaId }) =>
      qc.invalidateQueries({ queryKey: ['local:manga', mangaId] }),
  });
}

export function useRemoveMangaMutation(invalidateAll: boolean = false) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['local:manga'],
    mutationFn: (mangaId: string) =>
      db.table<SavedManga>(TB_MANGAS).delete(mangaId),
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

      await db.table<SavedManga>(TB_MANGAS).each((value) => {
        lines.push(buildLine(value));
      });

      return lines.join('\n');
    },
  });
}
