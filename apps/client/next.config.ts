import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rootPackage from '../../package.json' with { type: 'json' };

const clientRoot = path.dirname(fileURLToPath(import.meta.url));

const loadRootEnv = () => {
  const rootEnv = path.resolve(clientRoot, '..', '..', '.env');

  if (!existsSync(rootEnv)) {
    return;
  }

  for (const line of readFileSync(rootEnv, 'utf8').split('\n')) {
    const match = /^(NEXT_PUBLIC_[A-Z0-9_]*)=(.*)$/.exec(line.trim());

    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2];
    }
  }
};

loadRootEnv();

const withNextIntl = createNextIntlPlugin('./shared/i18n/request.ts');

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: rootPackage.version
  },
  output: 'export',
  reactCompiler: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  sassOptions: {
    loadPaths: [clientRoot]
  },
  turbopack: {
    resolveAlias: {
      '@': clientRoot
    }
  }
};

export default withNextIntl(nextConfig);
