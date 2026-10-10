import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { listFileStats } from '../list-file-stats';

let root: string;

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), 'list-file-stats-'));
  await mkdir(join(root, 'ab'), { recursive: true });
  await writeFile(join(root, 'top.webp'), 'x'.repeat(10));
  await writeFile(join(root, 'ab', 'nested.webp'), 'y'.repeat(25));
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('listFileStats', () => {
  it('lists files in nested folders with their sizes', async () => {
    const files = await listFileStats(root);
    const sizes = Object.fromEntries(files.map(({ path, size }) => [path, size]));

    expect(sizes).toEqual({ [join(root, 'top.webp')]: 10, [join(root, 'ab', 'nested.webp')]: 25 });
  });

  it('returns nothing for a folder that does not exist', async () => {
    await expect(listFileStats(join(root, 'missing'))).resolves.toEqual([]);
  });
});
