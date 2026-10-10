import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { writeFileAtomic } from '../write-file-atomic';

let root: string;

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), 'write-file-atomic-'));
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('writeFileAtomic', () => {
  it('creates missing folders and writes the bytes', async () => {
    const path = join(root, 'a', 'b', 'file.bin');

    await writeFileAtomic({ path, data: Buffer.from('hello') });

    expect((await readFile(path)).toString()).toBe('hello');
  });

  it('replaces an existing file and leaves no temporary behind', async () => {
    const path = join(root, 'replace.bin');

    await writeFileAtomic({ path, data: Buffer.from('old') });
    await writeFileAtomic({ path, data: Buffer.from('new') });

    expect((await readFile(path)).toString()).toBe('new');
    expect(await readdir(root)).not.toContainEqual(expect.stringMatching(/\.tmp$/));
  });
});
