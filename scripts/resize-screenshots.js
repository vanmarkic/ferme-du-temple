#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const MAX_DIMENSION = 8000;
const SCREENSHOTS_DIR = './tests/screenshots';

function getImageDimensions(imagePath) {
  try {
    const output = execSync(`sips -g pixelWidth -g pixelHeight "${imagePath}"`, { encoding: 'utf-8' });
    const widthMatch = output.match(/pixelWidth:\s*(\d+)/);
    const heightMatch = output.match(/pixelHeight:\s*(\d+)/);

    return {
      width: widthMatch ? parseInt(widthMatch[1]) : 0,
      height: heightMatch ? parseInt(heightMatch[1]) : 0
    };
  } catch (error) {
    console.error(`Error getting dimensions for ${imagePath}:`, error.message);
    return null;
  }
}

function resizeImage(imagePath, maxDimension) {
  try {
    const dimensions = getImageDimensions(imagePath);
    if (!dimensions) return false;

    const { width, height } = dimensions;
    const maxDim = Math.max(width, height);

    if (maxDim <= maxDimension) {
      console.log(`✓ ${imagePath} - already within limits (${width}x${height})`);
      return false;
    }

    // Calculate new dimensions maintaining aspect ratio
    const scale = maxDimension / maxDim;
    const newWidth = Math.round(width * scale);
    const newHeight = Math.round(height * scale);

    console.log(`↓ Resizing ${imagePath}...`);
    console.log(`  From: ${width}x${height} to ${newWidth}x${newHeight}`);

    // Use sips to resize the image
    execSync(`sips -z ${newHeight} ${newWidth} "${imagePath}"`, { encoding: 'utf-8' });

    console.log(`✓ Successfully resized ${imagePath}`);
    return true;
  } catch (error) {
    console.error(`✗ Error resizing ${imagePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = readdirSync(dirPath);
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

  let processedCount = 0;
  let resizedCount = 0;

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      continue;
    }

    const ext = file.toLowerCase().substring(file.lastIndexOf('.'));
    if (!imageExtensions.includes(ext)) {
      continue;
    }

    processedCount++;
    const wasResized = resizeImage(filePath, MAX_DIMENSION);
    if (wasResized) {
      resizedCount++;
    }
  }

  return { processedCount, resizedCount };
}

console.log(`Starting image resize process...`);
console.log(`Maximum dimension: ${MAX_DIMENSION}px`);
console.log(`Directory: ${SCREENSHOTS_DIR}\n`);

const { processedCount, resizedCount } = processDirectory(SCREENSHOTS_DIR);

console.log(`\n📊 Summary:`);
console.log(`  Processed: ${processedCount} images`);
console.log(`  Resized: ${resizedCount} images`);
console.log(`  Skipped: ${processedCount - resizedCount} images (already within limits)`);
