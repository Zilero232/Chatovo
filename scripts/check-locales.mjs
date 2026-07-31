import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { reporter, workspace } from './lib/shell.mjs';

const log = reporter('locales');

const LOCALES_DIR = join(workspace, 'apps', 'client', 'shared', 'i18n', 'locales');
const LEGAL_DOCUMENTS = ['privacyPage', 'termsPage'];

const read = (locale) => JSON.parse(readFileSync(join(LOCALES_DIR, `${locale}.json`), 'utf8'));

const flatten = (value, prefix = '') => {
  if (value === null || typeof value !== 'object') {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key)
  );
};

const en = read('en');
const ru = read('ru');

const problems = [];

const isLegalSection = (key) => key.startsWith('legal.');

const enKeys = new Set(flatten(en));
const ruKeys = new Set(flatten(ru));

const onlyEn = [...enKeys].filter((key) => !ruKeys.has(key) && !isLegalSection(key));
const onlyRu = [...ruKeys].filter((key) => !enKeys.has(key) && !isLegalSection(key));

if (onlyEn.length > 0) {
  problems.push(`missing in ru.json (${onlyEn.length}):\n  ${onlyEn.join('\n  ')}`);
}

if (onlyRu.length > 0) {
  problems.push(`missing in en.json (${onlyRu.length}):\n  ${onlyRu.join('\n  ')}`);
}

const drifted = LEGAL_DOCUMENTS.filter(
  (documentId) =>
    (en.legal?.[documentId]?.sections?.length ?? 0) !==
    (ru.legal?.[documentId]?.sections?.length ?? 0)
);

if (problems.length > 0) {
  log.fail(problems.join('\n\n'));
}

for (const documentId of drifted) {
  const enCount = en.legal[documentId].sections.length;
  const ruCount = ru.legal[documentId].sections.length;

  log.warn(
    `legal.${documentId}: en has ${enCount} sections, ru has ${ruCount} — the documents are ` +
      'positional arrays, so they read as different texts from the first missing section onwards'
  );
}

log.info(`en and ru agree on ${enKeys.size} keys outside legal/`);

process.exit(0);
