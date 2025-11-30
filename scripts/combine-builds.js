#!/usr/bin/env node

/**
 * Combines the credit app build into the web app's dist folder.
 * After turbo builds both apps:
 * - apps/web/dist/ contains the main site
 * - apps/credit/dist/ contains the credit app (built with base: '/admin/credit')
 *
 * This script copies credit's dist into web's dist/admin/credit/
 */

import { cpSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const webDist = join(root, 'apps/web/dist');
const creditDist = join(root, 'apps/credit/dist');
const targetDir = join(webDist, 'admin/credit');

if (!existsSync(webDist)) {
  console.error('❌ apps/web/dist not found. Run turbo build first.');
  process.exit(1);
}

if (!existsSync(creditDist)) {
  console.error('❌ apps/credit/dist not found. Run turbo build first.');
  process.exit(1);
}

// Ensure target directory exists
mkdirSync(targetDir, { recursive: true });

// Copy credit dist contents to web dist/admin/credit
cpSync(creditDist, targetDir, { recursive: true });

console.log('✅ Combined builds: apps/credit/dist → apps/web/dist/admin/credit');
