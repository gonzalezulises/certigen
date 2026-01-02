/**
 * Neon PostgreSQL Database Client
 * Edge-compatible serverless connection using HTTP mode
 */
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy initialization to avoid build-time evaluation
let _sql: NeonQueryFunction<false, false> | null = null;
let _db: NeonHttpDatabase<typeof schema> | null = null;

function getConnection() {
  if (!_sql || !_db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(databaseUrl);
    _db = drizzle(_sql, { schema });
  }
  return { sql: _sql, db: _db };
}

// Export lazy getters
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    const { db } = getConnection();
    return (db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function getSql() {
  return getConnection().sql;
}

// Re-export schema for convenience
export * from './schema';

// Re-export operations
export * from './operations';
