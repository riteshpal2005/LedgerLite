const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn("sharp is not installed, image conversion will fail.");
}

const withQuickTileServiceFile = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      // 1. Generate the Java code for TileService
      const packagePath = config.android.package.replace(/\./g, '/');
      const targetDir = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/java',
        packagePath
      );
      
      fs.mkdirSync(targetDir, { recursive: true });

      const javaCode = `package ${config.android.package};

import android.content.Intent;
import android.net.Uri;
import android.service.quicksettings.TileService;
import android.app.PendingIntent;
import android.os.Build;

public class QuickAddTileService extends TileService {
    @Override
    public void onClick() {
        super.onClick();
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("ledgerlite://quick-add"));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        
        if (Build.VERSION.SDK_INT >= 34) {
            PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 
                0, 
                intent, 
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            startActivityAndCollapse(pendingIntent);
        } else {
            startActivityAndCollapse(intent);
        }
    }
}
`;
      fs.writeFileSync(path.join(targetDir, 'QuickAddTileService.java'), javaCode);

      // 2. Convert and copy the asset to res/drawable as webp
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

const withQuickTileManifest = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const app = androidManifest.manifest.application[0];
    
    if (!app.service) {
      app.service = [];
    }

    const hasService = app.service.some(s => s.$ && s.$['android:name'] === '.QuickAddTileService');
    if (!hasService) {
      app.service.push({
        $: {
          'android:name': '.QuickAddTileService',
          'android:icon': '@drawable/ic_quick_add',
          'android:label': 'Quick Add Expense',
          'android:permission': 'android.permission.BIND_QUICK_SETTINGS_TILE',
          'android:exported': 'true'
        },
        'intent-filter': [{
          action: [{ $: { 'android:name': 'android.service.quicksettings.action.QS_TILE' } }]
        }]
      });
    }

    return config;
  });
};

module.exports = function withQuickTile(config) {
  config = withQuickTileServiceFile(config);
  config = withQuickTileManifest(config);
  return config;
};
