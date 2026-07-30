import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { requireEnv } from '../lib/env.mjs';
import { $, reporter, requireGh, workspace } from '../lib/shell.mjs';
import { releaseTag } from '../lib/version.mjs';
import { syncTauriVersion } from './sync-version.mjs';

const log = reporter('release:desktop');

const signingKey = join(homedir(), '.tauri', 'chatovo.key');

export const releaseDesktop = async () => {
  if (!existsSync(signingKey)) {
    log.fail(
      [
        `updater signing key missing: ${signingKey}`,
        '  create it with: bun tauri signer generate -w ~/.tauri/chatovo.key --password ""'
      ].join('\n')
    );
  }

  requireEnv(['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_LIVEKIT_URL']);

  const gh = await requireGh(log);
  const tag = releaseTag();

  syncTauriVersion();

  log.step('build client');
  await $`bun --filter @chatovo/client build`;

  log.step('build tauri desktop bundle');
  await $`bun --filter @chatovo/tauri build`.env({
    ...process.env,
    TAURI_SIGNING_PRIVATE_KEY: signingKey,
    TAURI_SIGNING_PRIVATE_KEY_PASSWORD: process.env.TAURI_SIGNING_PRIVATE_KEY_PASSWORD ?? ''
  });

  const bundle = join(workspace, 'apps', 'tauri', 'target', 'release', 'bundle');
  const assets =
    await $`find ${bundle} -type f \\( -name '*.exe' -o -name '*.msi' -o -name '*.sig' \\)`
      .nothrow()
      .text();

  const files = assets.split('\n').filter((line) => line.trim().length > 0);

  if (files.length === 0) {
    log.fail(`no desktop artifacts found under ${bundle}`);
  }

  log.step(`upload ${files.length} desktop asset(s) to ${tag}`);
  await $`${gh} release upload ${tag} ${files} --clobber`;

  log.info('desktop released');
};
