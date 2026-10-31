import {readFile} from 'node:fs/promises';
import {pool} from '../src/config/db.js';
try {
 const sql=await readFile(new URL('../migrations/001_init.sql',import.meta.url),'utf8');
 await pool.query('BEGIN'); await pool.query(sql); await pool.query('COMMIT');
 console.log('Database migration completed.');
} catch(e) { await pool.query('ROLLBACK').catch(()=>{}); console.error(e); process.exitCode=1; }
finally { await pool.end(); }
