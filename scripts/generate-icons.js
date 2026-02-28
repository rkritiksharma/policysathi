const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.25"/>
    </filter>
  </defs>
  
  <rect width="512" height="512" rx="128" fill="url(#grad)"/>
  
  <g filter="url(#shadow)" transform="translate(106, 106) scale(0.6)">
    <path d="M256 32L64 128V256C64 372.5 145.4 478 256 512C366.6 478 448 372.5 448 256V128L256 32Z" 
          fill="white" opacity="0.95"/>
    <path d="M176 256L224 304L336 192" 
          stroke="#4F46E5" stroke-width="32" fill="none" 
          stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`);

const publicDir = path.join(__dirname, '../public');
const appDir = path.join(__dirname, '../app');

async function generateIcons() {
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate 192x192 icon
    await sharp(svgBuffer)
        .resize(192, 192)
        .png()
        .toFile(path.join(publicDir, 'icon-192.png'));

    console.log('✅ Generated public/icon-192.png');

    // Generate 512x512 icon
    await sharp(svgBuffer)
        .resize(512, 512)
        .png()
        .toFile(path.join(publicDir, 'icon-512.png'));

    console.log('✅ Generated public/icon-512.png');

    // Generate favicon (32x32)
    await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(path.join(appDir, 'favicon.ico')); // Next.js App Router usually places favicon in app/ or public/

    // Also put favicon in public just in case
    await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('✅ Generated favicons');
}

generateIcons().catch(console.error);
