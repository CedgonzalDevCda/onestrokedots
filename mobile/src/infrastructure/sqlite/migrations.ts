import { db } from "@/src/data/sources/local/sqlite/db"

export function runMigrations() {
  // table interne pour suivre la version
  db.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY
    );
  `)

  const row = db.get<{ version: number }>(
    `SELECT MAX(version) as version FROM _migrations`
  )

  const currentVersion = row?.version ?? 0

  // ✅ MIGRATION V1
  if (currentVersion < 1) {
    db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
    `)

    db.run(`INSERT INTO _migrations (version) VALUES (1)`)
  }

  // ✅ MIGRATION V2 (exemple futur)
  if (currentVersion < 2) {
    // db.run(`ALTER TABLE progress ADD COLUMN updatedAt TEXT`)
    db.run(`INSERT INTO _migrations (version) VALUES (2)`)
  }
}
