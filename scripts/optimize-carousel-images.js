#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'carousel');

// Responsive sizes for carousel
// Mobile: displayed at 744x419 on most devices, create 750x422 for sharp quality
// Desktop: displayed at ~500-600px wide in 3-column layout, 800x450 is good for retina
const SIZES = {
  mobile: {
    width: 750,
    height: 422,
    quality: {
      webp: 78,
      avif: 50,  // More aggressive compression for mobile (targeting 30-40% reduction)
      jpg: 78
    }
  },
  desktop: {
    width: 800,
    height: 450,
    quality: {
      webp: 82,
      avif: 68,  // Slightly more aggressive compression
      jpg: 82
    }
  }
};

async function ensureDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err);
  }
}

async function optimizeCarouselImage(inputPath, filename, size, suffix = '') {
  const basename = path.basename(filename, path.extname(filename));
  const outputName = suffix ? `${basename}${suffix}` : basename;

  try {
    const image = sharp(inputPath);

    // Create WebP version
    await image
      .clone()
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'centre'
      })
      .webp({ quality: size.quality.webp, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `${outputName}.webp`));

    // Create AVIF version with higher compression
    await image
      .clone()
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'centre'
      })
      .avif({ quality: size.quality.avif, effort: 9 })
      .toFile(path.join(OUTPUT_DIR, `${outputName}.avif`));

    // Create optimized JPG fallback
    await image
      .clone()
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: size.quality.jpg, progressive: true })
      .toFile(path.join(OUTPUT_DIR, `${outputName}.jpg`));

    const webpStats = await fs.stat(path.join(OUTPUT_DIR, `${outputName}.webp`));
    const avifStats = await fs.stat(path.join(OUTPUT_DIR, `${outputName}.avif`));
    const jpgStats = await fs.stat(path.join(OUTPUT_DIR, `${outputName}.jpg`));

    return {
      webp: webpStats.size,
      avif: avifStats.size,
      jpg: jpgStats.size
    };

  } catch (err) {
    console.error(`Error optimizing ${filename} (${suffix || 'default'}):`, err);
    return null;
  }
}

async function processCarouselImages() {
  console.log('Starting carousel image optimization...');
  console.log(`Mobile: ${SIZES.mobile.width}x${SIZES.mobile.height} (AVIF q${SIZES.mobile.quality.avif})`);
  console.log(`Desktop: ${SIZES.desktop.width}x${SIZES.desktop.height} (AVIF q${SIZES.desktop.quality.avif})\n`);

  // Ensure output directory exists
  await ensureDirectory(OUTPUT_DIR);

  // Get all property images
  const files = await fs.readdir(ASSETS_DIR);
  const propertyImages = files.filter(f => f.startsWith('property-') && f.endsWith('.webp'));

  console.log(`Found ${propertyImages.length} property images to optimize\n`);

  // Process each image for both mobile and desktop
  for (const file of propertyImages) {
    const inputPath = path.join(ASSETS_DIR, file);
    const basename = path.basename(file, path.extname(file));
    const originalStats = await fs.stat(inputPath);

    console.log(`Optimizing ${basename}...`);
    console.log(`  Original: ${(originalStats.size / 1024).toFixed(1)}KB`);

    // Create mobile version with -mobile suffix
    const mobileStats = await optimizeCarouselImage(inputPath, file, SIZES.mobile, '-mobile');
    if (mobileStats) {
      console.log(`  Mobile (${SIZES.mobile.width}x${SIZES.mobile.height}):`);
      console.log(`    WebP: ${(mobileStats.webp / 1024).toFixed(1)}KB`);
      console.log(`    AVIF: ${(mobileStats.avif / 1024).toFixed(1)}KB (${Math.round((1 - mobileStats.avif / originalStats.size) * 100)}% smaller)`);
      console.log(`    JPG: ${(mobileStats.jpg / 1024).toFixed(1)}KB`);
    }

    // Create desktop version (no suffix)
    const desktopStats = await optimizeCarouselImage(inputPath, file, SIZES.desktop, '');
    if (desktopStats) {
      console.log(`  Desktop (${SIZES.desktop.width}x${SIZES.desktop.height}):`);
      console.log(`    WebP: ${(desktopStats.webp / 1024).toFixed(1)}KB`);
      console.log(`    AVIF: ${(desktopStats.avif / 1024).toFixed(1)}KB (${Math.round((1 - desktopStats.avif / originalStats.size) * 100)}% smaller)`);
      console.log(`    JPG: ${(desktopStats.jpg / 1024).toFixed(1)}KB`);
    }

    console.log('');
  }

  console.log('✨ Carousel image optimization complete!');
  console.log(`Optimized images saved to: ${OUTPUT_DIR}`);
}

// Run the optimization
processCarouselImages().catch(console.error);