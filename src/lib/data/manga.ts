import { openDb } from './database';

export interface MangaEnity {
  id: string;
  title: string;
  cover_url: string;
  tk: 1 | 0;
}

export async function findOne(mangaId: string) {
  const db = await openDb();
  const sql = 'SELECT * FROM Manga WHERE id = ?';
  return await db.get<MangaEnity>(sql, mangaId);
}

export async function save(manga: MangaEnity) {
  const db = await openDb();
  const sql =
    'INSERT INTO Manga (id, title, cover_url, tk) VALUES (?, ?, ?, ?)';
  const { id, title, cover_url, tk } = manga;
  await db.run(sql, id, title, cover_url, tk);
  return manga;
}

export async function isTakenDown(mangaId: string) {
  const db = await openDb();
  const sql = 'SELECT * FROM Manga WHERE id = ?';
  const manga = await db.get<MangaEnity>(sql, mangaId);
  return !!manga && manga.tk === 1;
}

export async function setTakenDown(mangaId: string, takenDown: boolean) {
  const db = await openDb();
  const sql = 'UPDATE Manga SET tk = ? WHERE id = ?';
  await db.run(sql, takenDown ? 1 : 0, mangaId);
}
