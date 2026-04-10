import * as SQLite from 'expo-sqlite'

const database = SQLite.openDatabaseSync('game.db')

type SQLiteValue = string | number | null

export const db = {
  run(query: string, params: SQLiteValue[] = []) {
    return database.runSync(query, params)
  },

  get<T>(query: string, params: SQLiteValue[] = []): T | null {
    return database.getFirstSync<T>(query, params) ?? null
  },

  getAll<T>(query: string, params: SQLiteValue[] = []): T[] {
    return database.getAllSync<T>(query, params)
  }
}
