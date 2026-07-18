const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bookSvgPath = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" fill="white" width="600" height="600" x="212" y="212"><path d="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 00-17.92 5.33A32 32 0 0016 79.9V366c0 19.34 13.76 33.93 32 33.93 71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 006.94-3V106.82a15.89 15.89 0 00-5.46-12A143 143 0 00202.24 74zM481.92 53.3A31.33 31.33 0 00464 48c-67.61.3-118.11 8.71-154.24 26a143.31 143.31 0 00-32.31 20.78 15.93 15.93 0 00-5.45 12v337.13a3.93 3.93 0 006.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0032-32v-288a32 32 0 00-14.12-26.61z"/></svg>`;

// The splash icon will be 1024x1024
// With a rounded rect 1024x1024 rx=256 and the book path centered
const splashSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="1024" height="1024" rx="256" fill="#6642f8" />
  ${bookSvgPath}
</svg>
`;

const foregroundSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  ${bookSvgPath}
</svg>
`;

async function main() {
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

  await sharp(Buffer.from(splashSvg))
    .png()
    .toFile(path.join(assetsDir, 'splash-icon.png'));

  await sharp(Buffer.from(splashSvg))
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));

  await sharp(Buffer.from(foregroundSvg))
    .png()
    .toFile(path.join(assetsDir, 'android-icon-foreground.png'));

  await sharp(Buffer.from(foregroundSvg))
    .png()
    .toFile(path.join(assetsDir, 'android-icon-monochrome.png'));
    
  console.log("Images generated!");
}

main().catch(console.error);
