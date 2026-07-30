import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { requireEnv } from '../lib/env.mjs';
import { collectFiles } from '../lib/files.mjs';
import { $, isWindows, reporter, requireGh, workspace } from '../lib/shell.mjs';
import { releaseTag, releaseVersion } from '../lib/version.mjs';

const log = reporter('release:android');

const tauri = join(workspace, 'apps', 'tauri');
const gen = join(tauri, 'gen', 'android');
const gradleFile = join(gen, 'app', 'build.gradle.kts');
const keystore = join(gen, 'chatovo.keystore');
const signingSnippet = join(tauri, 'scripts', 'android-signing.kts');

const writeKeystore = (creds) => {
  log.step('materialize keystore from ANDROID_KEY_BASE64');

  writeFileSync(keystore, Buffer.from(creds.ANDROID_KEY_BASE64, 'base64'));
  writeFileSync(
    join(gen, 'keystore.properties'),
    [
      `keyAlias=${creds.ANDROID_KEY_ALIAS}`,
      `password=${creds.ANDROID_KEY_PASSWORD}`,
      'storeFile=../chatovo.keystore',
      ''
    ].join('\n')
  );
};

const patchGradle = () => {
  let gradle = readFileSync(gradleFile, 'utf8');

  if (!gradle.includes('import java.io.FileInputStream')) {
    gradle = gradle.replace(
      'import java.util.Properties',
      'import java.io.FileInputStream\nimport java.util.Properties'
    );
  }

  if (gradle.includes('signingConfigs')) {
    gradle = gradle.replace(
      / {4}signingConfigs \{[\s\S]*?\r?\n {4}\}\r?\n/,
      readFileSync(signingSnippet, 'utf8')
    );
  } else {
    gradle = gradle.replace(
      '    buildTypes {',
      `${readFileSync(signingSnippet, 'utf8')}    buildTypes {`
    );
  }

  if (!gradle.includes('signingConfig = signingConfigs.getByName("release")')) {
    gradle = gradle.replace(
      'getByName("release") {',
      'getByName("release") {\n            signingConfig = signingConfigs.getByName("release")'
    );
  }

  writeFileSync(gradleFile, gradle);
  log.step('release signing wired into build.gradle.kts');
};

const findArtifact = (extension) => {
  const candidates = collectFiles(gen, [extension]).filter((path) =>
    /[/\\]outputs[/\\]/.test(path)
  );

  const universal = candidates.find((path) => /universal.*release/i.test(path));
  const release = candidates.find((path) => /release/i.test(path));
  const match = universal ?? release;

  if (!match) {
    log.fail(`no ${extension} produced under gen/android`);
  }

  return match;
};

const verifyApkSignature = async (creds, apk) => {
  log.step('verify apk signature');

  const buildTools = readdirSync(join(creds.ANDROID_HOME, 'build-tools')).sort().at(-1);
  const apksigner = join(
    creds.ANDROID_HOME,
    'build-tools',
    buildTools,
    isWindows ? 'apksigner.bat' : 'apksigner'
  );

  await $`${apksigner} verify --verbose ${apk}`;
};

export const releaseAndroid = async () => {
  const creds = requireEnv([
    'ANDROID_KEY_ALIAS',
    'ANDROID_KEY_PASSWORD',
    'ANDROID_KEY_BASE64',
    'ANDROID_HOME',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_LIVEKIT_URL'
  ]);

  const gh = await requireGh(log);
  const tag = releaseTag();
  const version = releaseVersion();

  log.step('init android project');
  await $`bun --filter @chatovo/tauri android:init`.nothrow();

  writeKeystore(creds);
  patchGradle();

  log.step('build android apk + aab');
  await $`bun --filter @chatovo/tauri android:build:all`.env({
    ...process.env,
    NODE_ENV: 'production'
  });

  const apk = findArtifact('.apk');
  const aab = findArtifact('.aab');

  await verifyApkSignature(creds, apk);

  const staging = join(tauri, 'target', 'android-release');

  mkdirSync(staging, { recursive: true });

  const named = [
    { from: apk, to: join(staging, `Chatovo_${version}_android.apk`) },
    { from: aab, to: join(staging, `Chatovo_${version}_android.aab`) }
  ];

  for (const { from, to } of named) {
    copyFileSync(from, to);
  }

  log.step(`upload apk + aab to ${tag}`);
  await $`${gh} release upload ${tag} ${named.map((file) => file.to)} --clobber`;

  log.info('android released');

  log.step('stop the gradle daemon so the process can exit');
  await $`${join(gen, isWindows ? 'gradlew.bat' : 'gradlew')} --stop`.cwd(gen).nothrow().quiet();
};
