'use client';

import {
  getChapter,
  getChapters,
  getIndexedDB,
  putChapter,
} from '@/lib/offline-chapters';
import type { SavedChapter, SavedChapterPage } from '@/types/saved-chapter';
import { createContext, useContext, useEffect, useRef } from 'react';

interface OfflineApi {
  getChapters: () => Promise<SavedChapter[]>;
  getChapter: (chapterId: number) => Promise<SavedChapterPage[]>;
  putChapter: (
    chapter: SavedChapter,
    pages: SavedChapterPage[]
  ) => Promise<void>;
}

type OfflineApiContextType = OfflineApi | null;

export const OfflineApiContext = createContext<OfflineApiContextType>(null);

export const OfflineApiProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // it hurts, but i cant find a better way
  const dbRef = useRef(
    (() => {
      let resolve:
          | ((value: IDBDatabase | PromiseLike<IDBDatabase>) => void)
          | null = null,
        reject: ((reason?: any) => void) | null = null;

      const promise = new Promise<IDBDatabase>((res, rej) => {
        resolve = res;
        reject = rej;
      });

      return { promise, resolve: resolve!, reject: reject! };
    })()
  );

  useEffect(() => {
    getIndexedDB()
      .then((db) => dbRef.current.resolve(db))
      .catch((reason) => dbRef.current.reject(reason));
  }, []);

  return (
    <OfflineApiContext.Provider
      value={{
        getChapter: async (chapterId) =>
          getChapter(await dbRef.current.promise, chapterId),
        getChapters: async () => getChapters(await dbRef.current.promise),
        putChapter: async (chapter, pages) =>
          putChapter(await dbRef.current.promise, chapter, pages),
      }}
    >
      {children}
    </OfflineApiContext.Provider>
  );
};

export const useOfflineApi = () => {
  return useContext(OfflineApiContext)!;
};
