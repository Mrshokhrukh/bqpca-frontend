import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, '../src/assets/rgob.png');
const targetDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  // Ensure target directory exists
  await fs.mkdir(targetDir, { recursive: true });

  // Generate icons for each size
  for (const size of sizes) {
    await sharp(sourceIcon)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(path.join(targetDir, `icon-${size}x${size}.png`));
  }

  // Generate apple-touch-icon (180x180)
  await sharp(sourceIcon)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(path.join(targetDir, 'apple-touch-icon.png'));

  // Generate favicon.ico (32x32)
  await sharp(sourceIcon)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toFile(path.join(targetDir, 'favicon.ico'));

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
