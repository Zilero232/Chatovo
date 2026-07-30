import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { workspace } from './shell.mjs';

export const releaseVersion = () => {
  const manifest = JSON.parse(readFileSync(join(workspace, 'package.json'), 'utf8'));

  return manifest.version;
};

export const releaseTag = () => `v${releaseVersion()}`;
