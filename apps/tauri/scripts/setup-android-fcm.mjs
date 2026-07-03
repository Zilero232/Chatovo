import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const tauriRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const googleServicesSrc = join(tauriRoot, 'android/google-services.json');
const genRoot = join(tauriRoot, 'gen/android');
const genApp = join(genRoot, 'app');
const appGradlePath = join(genApp, 'build.gradle.kts');
const rootGradlePath = join(genRoot, 'build.gradle.kts');

if (!existsSync(appGradlePath)) {
  console.warn('[fcm] gen/android not found — run `bun tauri:android:init` first');
  process.exit(0);
}

if (!existsSync(googleServicesSrc)) {
  console.warn('[fcm] android/google-services.json missing — push disabled on Android');
  process.exit(0);
}

copyFileSync(googleServicesSrc, join(genApp, 'google-services.json'));

let rootGradle = readFileSync(rootGradlePath, 'utf8');

if (!rootGradle.includes('com.google.gms:google-services')) {
  rootGradle = rootGradle.replace(
    'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.25")',
    'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.25")\n        classpath("com.google.gms:google-services:4.4.2")',
  );
  writeFileSync(rootGradlePath, rootGradle);
}

let appGradle = readFileSync(appGradlePath, 'utf8');

if (!appGradle.includes('com.google.gms.google-services')) {
  appGradle = appGradle.replace(
    'id("rust")',
    'id("rust")\n    id("com.google.gms.google-services")',
  );
  writeFileSync(appGradlePath, appGradle);
}

console.info('[fcm] google-services.json copied, Gradle plugin applied');
