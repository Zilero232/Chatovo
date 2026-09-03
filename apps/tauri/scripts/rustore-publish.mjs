import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appsApi, login } from 'rustore';

const WHATS_NEW_LIMIT = 5000;

// RuStore wants the Android release number (1-16), not the API level.
const API_LEVEL_TO_ANDROID = {
  21: 5,
  22: 5,
  23: 6,
  24: 7,
  25: 7,
  26: 8,
  27: 8,
  28: 9,
  29: 10,
  30: 11,
  31: 12,
  32: 12,
  33: 13,
  34: 14,
  35: 15,
  36: 16
};

const tauriRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const {
  RUSTORE_KEY_ID,
  RUSTORE_PRIVATE_KEY,
  RUSTORE_PACKAGE_NAME,
  RUSTORE_AAB_PATH,
  RUSTORE_WHATS_NEW,
  RUSTORE_WHATS_NEW_FILE
} = process.env;

const required = { RUSTORE_KEY_ID, RUSTORE_PRIVATE_KEY, RUSTORE_PACKAGE_NAME, RUSTORE_AAB_PATH };
const missing = Object.entries(required)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length > 0) {
  console.error(`[rustore] missing env: ${missing.join(', ')}`);
  process.exit(1);
}

if (!existsSync(RUSTORE_AAB_PATH)) {
  console.error(`[rustore] aab not found at ${RUSTORE_AAB_PATH}`);
  process.exit(1);
}

const readMinAndroidVersion = () => {
  const config = JSON.parse(readFileSync(join(tauriRoot, 'tauri.android.conf.json'), 'utf8'));
  const minSdk = config.bundle?.android?.minSdkVersion;
  const android = API_LEVEL_TO_ANDROID[minSdk];

  if (!android) {
    throw new Error(`cannot map minSdkVersion ${minSdk} to an Android release`);
  }

  return android;
};

const readWhatsNew = () => {
  const text =
    RUSTORE_WHATS_NEW ??
    (RUSTORE_WHATS_NEW_FILE && existsSync(RUSTORE_WHATS_NEW_FILE)
      ? readFileSync(RUSTORE_WHATS_NEW_FILE, 'utf8')
      : '');

  return text.trim().slice(0, WHATS_NEW_LIMIT) || undefined;
};

// The draft id comes back either bare or wrapped, depending on the endpoint.
const readVersionId = (response) => {
  const { body } = response;

  return typeof body === 'number' ? body : body?.versionId;
};

await login(RUSTORE_KEY_ID, RUSTORE_PRIVATE_KEY);
console.info('[rustore] authorized');

const draft = await appsApi.createDraftVersion(RUSTORE_PACKAGE_NAME, {
  // MANUAL keeps the release under human control: CI submits for review, a
  // person decides when it reaches users.
  publishType: 'MANUAL',
  minAndroidVersion: readMinAndroidVersion(),
  whatsNew: readWhatsNew()
});

const versionId = readVersionId(draft);

if (!versionId) {
  console.error(`[rustore] no versionId in the draft response: ${JSON.stringify(draft)}`);
  process.exit(1);
}

console.info(`[rustore] draft version ${versionId} created`);

// A draft that is never committed stays in the console and blocks the next
// upload, so a failure here has to take its own draft down with it.
try {
  await appsApi.uploadAabFile(RUSTORE_PACKAGE_NAME, versionId, RUSTORE_AAB_PATH, {
    isMainApk: true
  });
  console.info(`[rustore] uploaded ${basename(RUSTORE_AAB_PATH)}`);

  await appsApi.sendForModeration(RUSTORE_PACKAGE_NAME, versionId);
} catch (error) {
  console.error(`[rustore] publish failed, deleting draft ${versionId}`);

  await appsApi
    .deleteDraftVersion(RUSTORE_PACKAGE_NAME, versionId)
    .catch(() =>
      console.error(`[rustore] could not delete draft ${versionId} — remove it by hand`)
    );

  throw error;
}

console.info(`[rustore] version ${versionId} sent for moderation`);
