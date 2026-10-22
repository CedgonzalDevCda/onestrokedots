import { db } from "./db";

export async function initDatabase() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);

  const versionRow = await db.get<{ value: string }>(
    `SELECT value FROM meta WHERE key = 'db_version'`
  );

  const currentVersion = versionRow ? Number(versionRow.value) : 0;

  if (currentVersion < 1) {
    await db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
    `);

    await db.run(
      `INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)`,
      ["db_version", "1"]
    );
  }
}