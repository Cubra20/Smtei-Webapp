import { readFileSync } from 'fs';
import { pool } from './src/src/db.js';

async function migrate() {
  try {
    const sql = readFileSync('./migrations/001_create_tables.sql', 'utf8');
    await pool.query(sql);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();