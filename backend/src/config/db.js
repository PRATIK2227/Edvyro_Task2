import pg from 'pg';
import { env } from './env.js';
const { Pool } = pg;
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
pool.on('error', (error) => console.error('PostgreSQL pool error:', error.message));
