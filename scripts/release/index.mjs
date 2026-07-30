import { requireEnv } from '../lib/env.mjs';
import { $, reporter, requireGh } from '../lib/shell.mjs';
import { releaseTag, releaseVersion } from '../lib/version.mjs';
import { releaseAndroid } from './android.mjs';
import { releaseDesktop } from './desktop.mjs';
import { syncTauriVersion } from './sync-version.mjs';

const log = reporter('release');

requireEnv(['GITHUB_TOKEN']);

const gh = await requireGh(log);
const tag = releaseTag();
const version = releaseVersion();

const flags = process.argv.slice(2);
const onlyDesktop = flags.includes('--desktop');
const onlyAndroid = flags.includes('--android');
const runDesktop = onlyDesktop || !onlyAndroid;
const runAndroid = onlyAndroid || !onlyDesktop;

const releaseState = async () => {
  const result = await $`${gh} release view ${tag} --json isDraft`.nothrow().quiet();

  if (result.exitCode !== 0) {
    return 'missing';
  }

  return JSON.parse(result.text()).isDraft ? 'draft' : 'published';
};

const state = await releaseState();

if (state === 'published') {
  log.fail(`${tag} is already published — bump the version in package.json before releasing again`);
}

if (state === 'missing') {
  log.step(`create draft release ${tag}`);

  const notes = [
    `Chatovo v${version}`,
    '',
    '- Windows desktop installer (.exe / .msi)',
    '- Android build (.apk / .aab)'
  ].join('\n');

  await $`${gh} release create ${tag} --draft --title ${`Chatovo v${version}`} --notes ${notes}`;
} else {
  log.step(`reusing existing draft ${tag}`);
}

syncTauriVersion();

log.step('build client');
await $`bun --filter @chatovo/client build`.env({ ...process.env, NODE_ENV: 'production' });

if (runDesktop) {
  await releaseDesktop();
}

if (runAndroid) {
  await releaseAndroid();
}

log.step(`publish ${tag}`);
await $`${gh} release edit ${tag} --draft=false --latest`;

log.info(`released ${tag}`);

process.exit(0);
