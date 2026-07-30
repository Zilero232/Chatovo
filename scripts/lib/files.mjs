import { existsSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

export const collectFiles = (dir, extensions) => {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectFiles(path, extensions);
    }

    return extensions.includes(extname(entry.name).toLowerCase()) ? [path] : [];
  });
};
