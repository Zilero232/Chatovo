import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { reporter, workspace } from '../lib/shell.mjs';
import { releaseVersion } from '../lib/version.mjs';

const log = reporter('release:version');

const tauri = join(workspace, 'apps', 'tauri');

const patchJson = (path, version) => {
  const manifest = JSON.parse(readFileSync(path, 'utf8'));

  manifest.version = version;
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
};

const patchCargoToml = (path, version) => {
  const source = readFileSync(path, 'utf8');

  writeFileSync(
    path,
    source.replace(/(\[package\][^[]*?\r?\nversion = ")[^"]*(")/, `$1${version}$2`)
  );
};

const patchCargoLock = (path, version) => {
  const source = readFileSync(path, 'utf8');

  writeFileSync(
    path,
    source.replace(/(name = "chatovo"\r?\nversion = ")[^"]*(")/, `$1${version}$2`)
  );
};

export const syncTauriVersion = () => {
  const version = releaseVersion();

  patchJson(join(tauri, 'package.json'), version);
  patchJson(join(tauri, 'tauri.conf.json'), version);
  patchCargoToml(join(tauri, 'Cargo.toml'), version);
  patchCargoLock(join(tauri, 'Cargo.lock'), version);

  log.step(`synced tauri manifests to ${version}`);

  return version;
};
