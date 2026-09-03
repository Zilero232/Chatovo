import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const tauriRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const googleServicesSrc = join(tauriRoot, 'android/google-services.json');
const genApp = join(tauriRoot, 'gen/android/app');

if (!existsSync(genApp)) {
  console.warn('[fcm] gen/android not found — run `bun android:init` first');
  process.exit(0);
}

if (!existsSync(googleServicesSrc)) {
  console.warn('[fcm] android/google-services.json missing — push disabled on Android');
  process.exit(0);
}

// The Gradle plugin and its classpath come from [package.metadata.cargo-android]
// in Cargo.toml; only the config file itself has to be placed by hand.
copyFileSync(googleServicesSrc, join(genApp, 'google-services.json'));

console.info('[fcm] google-services.json copied into gen/android/app');
