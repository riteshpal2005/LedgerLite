const { withAppBuildGradle } = require('@expo/config-plugins');

const withAndroidSigning = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let contents = config.modResults.contents;

      // 1. Define splits block (without surrounding empty lines)
      const splitsBlock = `    splits {
        abi {
            enable true
            reset()
            include "arm64-v8a"
            universalApk false
        }
    }`;

      // 2. Define signingConfigs block (without trailing empty lines)
      const signingConfigsBlock = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            // Use env vars for CI/CD signing; fallback to defaults for local dev
            storeFile file(System.getenv('KEYSTORE_FILE') ?: "debug.keystore")
            storePassword System.getenv('KEYSTORE_PASSWORD') ?: 'android'
            keyAlias System.getenv('KEY_ALIAS') ?: 'androiddebugkey'
            keyPassword System.getenv('KEY_PASSWORD') ?: 'android'
        }
    }`;

      // Remove any existing splits block that might have been added before
      contents = contents.replace(/[\r\n]*\s*splits\s*\{[\s\S]*?universalApk false\s*\}\s*\}/g, '');

      // Replace the default signingConfigs block entirely, and insert splits right after it, just before buildTypes
      if (contents.includes('signingConfigs {')) {
        contents = contents.replace(
          /signingConfigs\s*\{[\s\S]*?(?=buildTypes\s*\{)/,
          `${signingConfigsBlock}\n${splitsBlock}\n    `
        );
      }

      // 3. Ensure buildTypes release uses signingConfigs.release
      contents = contents.replace(
        /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.(?:debug|release)/,
        '$1signingConfig signingConfigs.release'
      );

      config.modResults.contents = contents;
    }
    return config;
  });
};

module.exports = withAndroidSigning;
