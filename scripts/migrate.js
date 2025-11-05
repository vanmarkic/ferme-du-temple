import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationsDir = join(__dirname, '../supabase/migrations');

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
});

async function migrate() {
  try {
    await client.connect();

    // Get all SQL migration files and sort them
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${migrationFiles.length} migration(s) to run`);

    // Run each migration in order
    for (const file of migrationFiles) {
      const migrationPath = join(migrationsDir, file);
      const sql = readFileSync(migrationPath, 'utf8');
      console.log(`Running migration: ${file}`);
      await client.query(sql);
      console.log(`✓ ${file} completed`);
    }

    console.log('\nAll migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
