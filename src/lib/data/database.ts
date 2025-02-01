import sqlite3 from 'sqlite3';
import { type Database, open } from 'sqlite';

declare global {
  var _db: Database<sqlite3.Database, sqlite3.Statement> | undefined;
}

export async function openDb() {
  if (typeof global._db !== 'undefined') return global._db;

  const file = process.env['DB_FILE'];

  global._db = await open({
    driver: sqlite3.cached.Database,
    filename: file ?? './db.sqlite',
  });
  console.log('Database connection opened successfully.');

  await global._db.migrate();
  console.log('Database migration completed successfully.');

  if (process.env.NEXT_MANUAL_SIG_HANDLE) {
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal: closing db connection.');
      try {
        await global._db?.close();
        console.log('Database connection closed gracefully.');
        process.exit(0);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }

  return global._db;
}
