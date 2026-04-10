import { db } from "./db"

export function initDatabase() {
  // ✅ table meta
  db.run(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `)

  // ✅ lire version
  const versionRow = db.get<{ value: string }>(
    `SELECT value FROM meta WHERE key = 'db_version'`
  )

  const currentVersion = versionRow ? Number(versionRow.value) : 0

  // ✅ migration v1
  if (currentVersion < 1) {
    db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
    `)

    db.run(
      `INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)`,
      ["db_version", "1"]
    )
  }
}
