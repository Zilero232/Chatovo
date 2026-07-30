import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { requireEnv } from '../lib/env.mjs';
import { $, reporter, requireGh, workspace } from '../lib/shell.mjs';
import { releaseTag } from '../lib/version.mjs';
import { syncTauriVersion } from './sync-version.mjs';

const log = reporter('release:android');

const tauri = join(workspace, 'apps', 'tauri');

const materializeKeystore = (creds) => {
  const keystore = join(tauri, 'release.keystore');

  writeFileSync(keystore, Buffer.from(creds.ANDROID_KEY_BASE64, 'base64'));

  const properties = [
    `keyAlias=${creds.ANDROID_KEY_ALIAS}`,
    `password=${creds.ANDROID_KEY_PASSWORD}`,
    `storeFile=${keystore.replace(/\\/g, '/')}`
  ].join('\n');

  writeFileSync(join(tauri, 'gen', 'android', 'keystore.properties'), `${properties}\n`);

  return keystore;
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

  syncTauriVersion();

  log.step('build client');
  await $`bun --filter @chatovo/client build`.env({ ...process.env, NODE_ENV: 'production' });

  log.step('init android project');
  await $`bun --filter @chatovo/tauri android:init`.nothrow();

  materializeKeystore(creds);

  log.step('build android apk + aab');
  await $`bun --filter @chatovo/tauri android:build`.env({
    ...process.env,
    NODE_ENV: 'production'
  });
  await $`bun --filter @chatovo/tauri android:build:aab`.env({
    ...process.env,
    NODE_ENV: 'production'
  });

  const outputs = join(tauri, 'gen', 'android', 'app', 'build', 'outputs');
  const assets = await $`find ${outputs} -type f \\( -name '*.apk' -o -name '*.aab' \\)`
    .nothrow()
    .text();

  const files = assets.split('\n').filter((line) => line.trim().length > 0);

  if (files.length === 0) {
    log.fail(`no android artifacts found under ${outputs}`);
  }

  log.step(`upload ${files.length} android asset(s) to ${tag}`);
  await $`${gh} release upload ${tag} ${files} --clobber`;

  log.info('android released');
};
