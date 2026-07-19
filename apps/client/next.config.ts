import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createNextIntlPlugin from 'next-intl/plugin';

import rootPackage from '../../package.json' with { type: 'json' };

import type { NextConfig } from 'next';

const clientRoot = path.dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin('./shared/i18n/request.ts');

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: rootPackage.version,
  },
  output: 'export',
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  sassOptions: {
    loadPaths: [clientRoot],
  },
  turbopack: {
    resolveAlias: {
      '@': clientRoot,
    },
  },
};

export default withNextIntl(nextConfig);
