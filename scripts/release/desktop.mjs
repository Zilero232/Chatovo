import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';

import { requireEnv } from '../lib/env.mjs';
import { collectFiles } from '../lib/files.mjs';
import { $, reporter, requireGh, workspace } from '../lib/shell.mjs';
import { releaseTag, releaseVersion } from '../lib/version.mjs';

const log = reporter('release:desktop');

const DESKTOP_ASSET_EXTENSIONS = ['.exe', '.msi', '.sig'];

const RELEASES_URL = 'https://github.com/Zilero232/Chatovo/releases/download';

const signingKey = join(homedir(), '.tauri', 'chatovo.key');

const writeUpdaterManifest = ({ files, version, tag }) => {
  const installer = files.find((path) => path.endsWith('-setup.exe'));
  const signature = files.find((path) => path.endsWith('-setup.exe.sig'));

  if (!installer || !signature) {
    log.fail('no signed NSIS installer found — the updater manifest needs both .exe and .exe.sig');
  }

  const manifest = {
    version,
    pub_date: new Date().toISOString(),
    platforms: {
      'windows-x86_64': {
        signature: readFileSync(signature, 'utf8').trim(),
        url: `${RELEASES_URL}/${tag}/${basename(installer)}`
      }
    }
  };

  const path = join(workspace, 'apps', 'tauri', 'target', 'release', 'latest.json');

  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
  log.step(`updater manifest for ${version}`);

  return path;
};

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

  const version = releaseVersion();

  log.step('build tauri desktop bundle');
  await $`bun --filter @chatovo/tauri build`.env({
    ...process.env,
    NODE_ENV: 'production',
    TAURI_SIGNING_PRIVATE_KEY: readFileSync(signingKey, 'utf8'),
    TAURI_SIGNING_PRIVATE_KEY_PASSWORD: process.env.TAURI_SIGNING_PRIVATE_KEY_PASSWORD ?? ''
  });

  const bundle = join(workspace, 'apps', 'tauri', 'target', 'release', 'bundle');
  const files = collectFiles(bundle, DESKTOP_ASSET_EXTENSIONS).filter((path) =>
    path.includes(version)
  );

  if (files.length === 0) {
    log.fail(`no desktop artifacts found under ${bundle}`);
  }

  const manifest = writeUpdaterManifest({ files, version, tag });

  log.step(`upload ${files.length + 1} desktop asset(s) to ${tag}`);
  await $`${gh} release upload ${tag} ${[...files, manifest]} --clobber`;

  log.info('desktop released');
};
