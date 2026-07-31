import sharp from 'sharp';

// Play Store icon: 512x512, flattened onto dark navy so corners aren't transparent
await sharp('resources/icon.png')
  .resize(512, 512)
  .flatten({ background: '#08131F' })
  .png()
  .toFile('store-assets/play-icon-512.png');

const iconB64 = (await sharp('resources/icon.png').resize(560, 560).png().toBuffer()).toString('base64');

const svg = `
<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1220"/>
      <stop offset="100%" stop-color="#12213A"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <circle cx="880" cy="80" r="220" fill="#10B981" opacity="0.07"/>
  <circle cx="120" cy="460" r="180" fill="#10B981" opacity="0.05"/>
  <image href="data:image/png;base64,${iconB64}" x="70" y="90" width="320" height="320"/>
  <text x="420" y="235" font-family="Segoe UI, Arial, sans-serif" font-size="86" font-weight="800" fill="#FFFFFF">Olta App</text>
  <text x="422" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="#34D399">Türkiye'nin Balıkçılık Uygulaması</text>
  <text x="422" y="352" font-family="Segoe UI, Arial, sans-serif" font-size="21" font-weight="400" fill="#94A3B8">Balık ansiklopedisi · Hava &amp; solunar · Topluluk · Av günlüğü</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('store-assets/feature-graphic-1024x500.png');
console.log('done');
