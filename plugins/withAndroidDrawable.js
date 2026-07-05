const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn("sharp is not installed, image conversion will fail.");
}

const withAndroidDrawable = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      if (sharp) {
        const sourceImage = path.join(config.modRequest.projectRoot, 'assets', 'ic_quick_add.png');
        const drawableDir = path.join(config.modRequest.platformProjectRoot, 'app/src/main/res/drawable');
        
        fs.mkdirSync(drawableDir, { recursive: true });
        
        const targetImage = path.join(drawableDir, 'ic_quick_add.webp');
        
        if (fs.existsSync(sourceImage)) {
          await sharp(sourceImage)
            .webp({ quality: 90 })
            .toFile(targetImage);
        } else {
          console.warn("Source image assets/ic_quick_add.png not found.");
        }
      }

      return config;
    },
  ]);
};

module.exports = withAndroidDrawable;
