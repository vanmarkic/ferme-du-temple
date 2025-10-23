import { readFileSync } from 'fs';
import { join } from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationPath = join(__dirname, '../supabase/migrations/001_create_inscriptions_table.sql');
const sql = readFileSync(migrationPath, 'utf8');

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
});

async function migrate() {
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
