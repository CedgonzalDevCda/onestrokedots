import * as SQLite from "expo-sqlite";

let database: SQLite.SQLiteDatabase | null = null;

async function getDb() {
  if (!database) {
    database = await SQLite.openDatabaseAsync("game.db");
  }
  return database;
}

type SQLiteValue = string | number | null;

export const db = {
  async run(query: string, params: SQLiteValue[] = []) {
    const db = await getDb();
    return await db.runAsync(query, params);
  },

  async get<T>(query: string, params: SQLiteValue[] = []): Promise<T | null> {
    const db = await getDb();
    const result = await db.getFirstAsync<T>(query, params);
    return result ?? null;
  },

  async getAll<T>(query: string, params: SQLiteValue[] = []): Promise<T[]> {
    const db = await getDb();
    return await db.getAllAsync<T>(query, params);
  },
};
