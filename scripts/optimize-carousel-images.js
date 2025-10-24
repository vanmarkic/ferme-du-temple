#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'carousel');

// Optimal size for carousel (displayed at 744x419)
// We'll make it slightly larger for retina displays
const CAROUSEL_WIDTH = 800;
const CAROUSEL_HEIGHT = 450;

// Higher compression for smaller files
const QUALITY = {
  webp: 82,
  avif: 75,
  jpg: 82
};

async function ensureDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err);
  }
}

async function optimizeCarouselImage(inputPath, filename) {
  const basename = path.basename(filename, path.extname(filename));

  console.log(`Optimizing ${filename} for carousel...`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculate aspect ratio preserving dimensions
    let resizeWidth = CAROUSEL_WIDTH;
    let resizeHeight = null;

    if (metadata.width && metadata.height) {
      const aspectRatio = metadata.width / metadata.height;
      const targetAspectRatio = CAROUSEL_WIDTH / CAROUSEL_HEIGHT;

      if (aspectRatio > targetAspectRatio) {
        // Image is wider than target, fit by width
        resizeWidth = CAROUSEL_WIDTH;
        resizeHeight = Math.round(CAROUSEL_WIDTH / aspectRatio);
      } else {
        // Image is taller than target, fit by height
        resizeHeight = CAROUSEL_HEIGHT;
        resizeWidth = Math.round(CAROUSEL_HEIGHT * aspectRatio);
      }
    }

    // Create WebP version
    await image
      .resize(resizeWidth, resizeHeight, {
        fit: 'cover',
        position: 'centre'
      })
      .webp({ quality: QUALITY.webp, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `${basename}.webp`));

    // Create AVIF version with higher compression
    await image
      .resize(resizeWidth, resizeHeight, {
        fit: 'cover',
        position: 'centre'
      })
      .avif({ quality: QUALITY.avif, effort: 9 })
      .toFile(path.join(OUTPUT_DIR, `${basename}.avif`));

    // Create optimized JPG fallback
    await image
      .resize(resizeWidth, resizeHeight, {
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: QUALITY.jpg, progressive: true })
      .toFile(path.join(OUTPUT_DIR, `${basename}.jpg`));

    const webpStats = await fs.stat(path.join(OUTPUT_DIR, `${basename}.webp`));
    const avifStats = await fs.stat(path.join(OUTPUT_DIR, `${basename}.avif`));
    const jpgStats = await fs.stat(path.join(OUTPUT_DIR, `${basename}.jpg`));
    const originalStats = await fs.stat(inputPath);

    console.log(`  ✓ ${basename} optimized:`);
    console.log(`    Original: ${(originalStats.size / 1024).toFixed(1)}KB`);
    console.log(`    WebP: ${(webpStats.size / 1024).toFixed(1)}KB (${Math.round((1 - webpStats.size / originalStats.size) * 100)}% smaller)`);
    console.log(`    AVIF: ${(avifStats.size / 1024).toFixed(1)}KB (${Math.round((1 - avifStats.size / originalStats.size) * 100)}% smaller)`);
    console.log(`    JPG: ${(jpgStats.size / 1024).toFixed(1)}KB (${Math.round((1 - jpgStats.size / originalStats.size) * 100)}% smaller)`);

  } catch (err) {
    console.error(`Error optimizing ${filename}:`, err);
  }
}

async function processCarouselImages() {
  console.log('Starting carousel image optimization...');
  console.log(`Target dimensions: ${CAROUSEL_WIDTH}x${CAROUSEL_HEIGHT}`);

  // Ensure output directory exists
  await ensureDirectory(OUTPUT_DIR);

  // Get all property images
  const files = await fs.readdir(ASSETS_DIR);
  const propertyImages = files.filter(f => f.startsWith('property-') && f.endsWith('.webp'));

  console.log(`Found ${propertyImages.length} property images to optimize\n`);

  // Process each image
  for (const file of propertyImages) {
    const inputPath = path.join(ASSETS_DIR, file);
    await optimizeCarouselImage(inputPath, file);
  }

  console.log('\n✨ Carousel image optimization complete!');
  console.log(`Optimized images saved to: ${OUTPUT_DIR}`);
}

// Run the optimization
processCarouselImages().catch(console.error);