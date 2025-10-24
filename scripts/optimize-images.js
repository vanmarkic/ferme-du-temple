#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const WEBP_DIR = path.join(ASSETS_DIR, 'optimized');

// Image size variants for responsive images
const SIZES = {
  mobile: 640,
  tablet: 1024,
  desktop: 1920,
  full: null // Original size
};

// Image quality settings
const QUALITY = {
  webp: 85,
  avif: 80,
  jpg: 85
};

async function ensureDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err);
  }
}

async function optimizeImage(inputPath, filename) {
  const basename = path.basename(filename, path.extname(filename));
  const ext = path.extname(filename).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`Skipping ${filename} - not an image to optimize`);
    return;
  }

  console.log(`Optimizing ${filename}...`);

  // Process each size variant
  for (const [sizeName, width] of Object.entries(SIZES)) {
    const sizeDir = path.join(WEBP_DIR, sizeName);
    await ensureDirectory(sizeDir);

    // Create WebP version
    try {
      const webpPath = path.join(sizeDir, `${basename}.webp`);
      const pipeline = sharp(inputPath);

      if (width) {
        pipeline.resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      await pipeline
        .webp({ quality: QUALITY.webp })
        .toFile(webpPath);

      const stats = await fs.stat(webpPath);
      const originalStats = await fs.stat(inputPath);
      const savings = ((1 - stats.size / originalStats.size) * 100).toFixed(1);
      console.log(`  ✅ ${sizeName} WebP: ${(stats.size / 1024).toFixed(1)}KB (${savings}% savings)`);
    } catch (err) {
      console.error(`  ❌ Error creating WebP for ${filename} (${sizeName}):`, err.message);
    }

    // Create AVIF version (for modern browsers)
    try {
      const avifPath = path.join(sizeDir, `${basename}.avif`);
      const pipeline = sharp(inputPath);

      if (width) {
        pipeline.resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      await pipeline
        .avif({ quality: QUALITY.avif })
        .toFile(avifPath);

      const stats = await fs.stat(avifPath);
      const originalStats = await fs.stat(inputPath);
      const savings = ((1 - stats.size / originalStats.size) * 100).toFixed(1);
      console.log(`  ✅ ${sizeName} AVIF: ${(stats.size / 1024).toFixed(1)}KB (${savings}% savings)`);
    } catch (err) {
      console.error(`  ❌ Error creating AVIF for ${filename} (${sizeName}):`, err.message);
    }

    // Create optimized JPG fallback
    if (ext !== '.png') {
      try {
        const jpgPath = path.join(sizeDir, `${basename}.jpg`);
        const pipeline = sharp(inputPath);

        if (width) {
          pipeline.resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        }

        await pipeline
          .jpeg({ quality: QUALITY.jpg, progressive: true })
          .toFile(jpgPath);

        const stats = await fs.stat(jpgPath);
        const originalStats = await fs.stat(inputPath);
        const savings = ((1 - stats.size / originalStats.size) * 100).toFixed(1);
        console.log(`  ✅ ${sizeName} JPG: ${(stats.size / 1024).toFixed(1)}KB (${savings}% savings)`);
      } catch (err) {
        console.error(`  ❌ Error creating optimized JPG for ${filename} (${sizeName}):`, err.message);
      }
    }
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');

  // Ensure output directory exists
  await ensureDirectory(WEBP_DIR);

  // Get all files in assets directory
  const files = await fs.readdir(ASSETS_DIR);

  // Process only the large JPG files that need optimization
  const imagesToOptimize = [
    'ferme-du-temple-hero.jpg',
    'interior-1.jpg',
    'building-exterior.jpg',
    'greenhouse.jpg',
    'community-field.jpg',
    'floor-plan.png'
  ];

  for (const file of files) {
    if (imagesToOptimize.includes(file)) {
      const inputPath = path.join(ASSETS_DIR, file);
      await optimizeImage(inputPath, file);
    }
  }

  console.log('\n✨ Image optimization complete!');
  console.log('📁 Optimized images saved to:', WEBP_DIR);
}

main().catch(console.error);