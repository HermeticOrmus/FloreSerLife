/**
 * Generate PWA Icons
 * Creates placeholder PWA icons in various sizes
 *
 * Usage: node scripts/generate-pwa-icons.js
 */

import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = resolve(__dirname, '../client/public/icons');

// Simple SVG template for placeholder icons
function generateIconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#2F4F4F"/>

  <!-- Leaf/Nature Icon -->
  <g transform="translate(${size/2}, ${size/2})">
    <path d="M-${size*0.25},0 Q-${size*0.15},-${size*0.3} 0,-${size*0.35} Q${size*0.15},-${size*0.3} ${size*0.25},0 Q${size*0.15},${size*0.15} 0,${size*0.2} Q-${size*0.15},${size*0.15} -${size*0.25},0"
          fill="#D4AF37"
          opacity="0.9"/>
    <path d="M0,-${size*0.35} Q0,-${size*0.1} 0,${size*0.2}"
          stroke="#8FBC8F"
          stroke-width="${size*0.02}"
          fill="none"/>
  </g>

  <!-- Brand Text (for larger sizes) -->
  ${size >= 192 ? `
  <text x="50%" y="85%"
        text-anchor="middle"
        font-family="serif"
        font-size="${size*0.12}"
        font-weight="bold"
        fill="#D4AF37">
    FloreSer
  </text>` : ''}
</svg>`;
}

async function generateIcons() {
  try {
    // Create icons directory
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created directory: ${OUTPUT_DIR}`);

    // Generate icons for each size
    for (const size of ICON_SIZES) {
      const filename = `icon-${size}x${size}.png`;
      const svgContent = generateIconSVG(size);

      // For now, save as SVG (in production, you'd convert to PNG)
      // You can use sharp or canvas to convert SVG to PNG
      const svgFilename = `icon-${size}x${size}.svg`;
      const svgPath = resolve(OUTPUT_DIR, svgFilename);

      const writeStream = createWriteStream(svgPath);
      writeStream.write(svgContent);
      writeStream.end();

      console.log(`✅ Generated ${svgFilename}`);
    }

    console.log('\n🎉 PWA icons generated successfully!');
    console.log('\n📝 Note: SVG icons created. For production, convert to PNG using:');
    console.log('   - sharp library: npm install sharp');
    console.log('   - OR use an online converter');
    console.log('   - OR use Figma/design tool to export');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
