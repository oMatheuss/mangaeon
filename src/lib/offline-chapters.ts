import type { SavedChapter, SavedChapterPage } from '@/types/saved-chapter';

const DATABASE_NAME = 'offline-chapters';
const DATABASE_VERSION = 1;
const CHAPTERS_OBJECT_NAME = 'chapters';
const PAGES_OBJECT_NAME = 'pages';

const createChaptersObjectStore = async (
  db: IDBDatabase
): Promise<IDBDatabase> => {
  const objectStore = db.createObjectStore(CHAPTERS_OBJECT_NAME, {
    keyPath: 'chapterId',
  });

  // create an index on mangaId, so we can group by manga
  objectStore.createIndex('mangaId', 'mangaId', { unique: false });

  // create an index on downloaded, so we can find what we need to download next
  objectStore.createIndex('downloaded', 'downloaded', { unique: false });

  return new Promise((resolve, reject) => {
    objectStore.transaction.oncomplete = () => {
      resolve(db);
    };

    objectStore.transaction.onerror = () => {
      reject(objectStore.transaction.error?.message);
    };
  });
};

const createPagesObjectStore = async (
  db: IDBDatabase
): Promise<IDBDatabase> => {
  const objectStore = db.createObjectStore(PAGES_OBJECT_NAME, {
    keyPath: 'chapterId',
    autoIncrement: true,
  });

  return new Promise((resolve, reject) => {
    objectStore.transaction.oncomplete = () => {
      resolve(db);
    };

    objectStore.transaction.onerror = () => {
      reject(objectStore.transaction.error?.message);
    };
  });
};

export const getIndexedDB = () => {
  if (typeof window === 'undefined')
    throw 'IndexedDB should only run on the client';

  const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  return new Promise<IDBDatabase>((resolve, reject) => {
    request.onerror = () => {
      reject('O uso ao IndexedDB foi recusado pelo usuário');
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      createChaptersObjectStore(db);
      createPagesObjectStore(db);
    };
  });
};

export const getChapters = (db: IDBDatabase) => {
  const transaction = db.transaction([CHAPTERS_OBJECT_NAME], 'readonly');
  const objectStore = transaction.objectStore(CHAPTERS_OBJECT_NAME);
  const request = objectStore.getAll();
  return new Promise<SavedChapter[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as SavedChapter[]);
    request.onerror = () => reject(request.error?.name);
  });
};

export const getChapter = (db: IDBDatabase, chapterId: number) => {
  const transaction = db.transaction([PAGES_OBJECT_NAME], 'readonly');
  const objectStore = transaction.objectStore(PAGES_OBJECT_NAME);
  const request = objectStore.getAll(chapterId);
  return new Promise<SavedChapterPage[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as SavedChapterPage[]);
    request.onerror = () => reject(request.error?.name);
  });
};

export const putChapter = async (
  db: IDBDatabase,
  chapter: SavedChapter,
  pages: SavedChapterPage[]
) => {
  const transaction = db.transaction(
    [CHAPTERS_OBJECT_NAME, PAGES_OBJECT_NAME],
    'readwrite'
  );

  const chapterObjectStore = transaction.objectStore(CHAPTERS_OBJECT_NAME);
  await new Promise<void>((resolve, reject) => {
    const request = chapterObjectStore.put(chapter);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error?.name);
  });

  const pagesObjectStore = transaction.objectStore(PAGES_OBJECT_NAME);
  await new Promise<void>((resolve, reject) => {
    const request = pagesObjectStore.delete(chapter.chapterId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error?.name);
  });

  for (const page of pages) {
    await new Promise<void>((resolve, reject) => {
      const request = pagesObjectStore.add(page);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error?.name);
    });
  }
};
