import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const tauriRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const genRoot = join(tauriRoot, 'gen/android');
const gradlePath = join(genRoot, 'app/build.gradle.kts');
const keystorePath = join(genRoot, 'chatovo.keystore');
const snippetPath = join(tauriRoot, 'scripts/android-signing.kts');

const { ANDROID_KEY_ALIAS, ANDROID_KEY_BASE64, ANDROID_KEY_PASSWORD } = process.env;

if (!ANDROID_KEY_ALIAS || !ANDROID_KEY_PASSWORD || !ANDROID_KEY_BASE64) {
  console.error(
    '[signing] ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD and ANDROID_KEY_BASE64 are required'
  );
  process.exit(1);
}

writeFileSync(keystorePath, Buffer.from(ANDROID_KEY_BASE64, 'base64'));
writeFileSync(
  join(genRoot, 'keystore.properties'),
  [
    `keyAlias=${ANDROID_KEY_ALIAS}`,
    `password=${ANDROID_KEY_PASSWORD}`,
    'storeFile=../chatovo.keystore',
    ''
  ].join('\n')
);

const snippet = readFileSync(snippetPath, 'utf8');

let gradle = readFileSync(gradlePath, 'utf8');

if (!gradle.includes('import java.io.FileInputStream')) {
  gradle = gradle.replace(
    'import java.util.Properties',
    'import java.io.FileInputStream\nimport java.util.Properties'
  );
}

if (gradle.includes('signingConfigs')) {
  gradle = gradle.replace(/ {4}signingConfigs \{[\s\S]*?\r?\n {4}\}\r?\n/, snippet);
} else {
  gradle = gradle.replace('    buildTypes {', `${snippet}    buildTypes {`);
}

if (!gradle.includes('signingConfig = signingConfigs.getByName("release")')) {
  gradle = gradle.replace(
    'getByName("release") {',
    'getByName("release") {\n            signingConfig = signingConfigs.getByName("release")'
  );
}

writeFileSync(gradlePath, gradle);

console.log('[signing] release signing wired into build.gradle.kts');
