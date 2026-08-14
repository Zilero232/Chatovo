import type { NextConfig } from 'next';

import { config as loadEnv } from 'dotenv';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rootPackage from '../../package.json' with { type: 'json' };

const clientRoot = path.dirname(fileURLToPath(import.meta.url));

// The single `.env` lives at the monorepo root, while Next only looks next to the app.
// dotenv never overrides already-set variables, so CI and shell environment win.
loadEnv({ path: path.resolve(clientRoot, '..', '..', '.env'), quiet: true });

const nextConfig = {
  // Static export: served by Caddy on the web and bundled into the Tauri shell.
  // No SSR, no middleware, no runtime image optimizer.
  output: 'export',
  images: {
    unoptimized: true
  },

  // Statically typed `<Link href>` and `router.push` — route types land in `.next/types`.
  typedRoutes: true,

  // React Compiler memoizes automatically; manual useMemo/useCallback stay only
  // where a semantically stable ref is required.
  reactCompiler: true,

  // Strict mode is off: the double effect mount tears down the LiveKit room connection.
  reactStrictMode: false,

  env: {
    NEXT_PUBLIC_APP_VERSION: rootPackage.version
  },

  // `implementation: 'sass-embedded'` — native Dart binary, the fastest compiler.
  // `loadPaths` enables absolute `@use '@/ui-kit/styles/...'` instead of `../../../` chains.
  // `quietDeps` silences deprecations coming from node_modules.
  sassOptions: {
    implementation: 'sass-embedded',
    loadPaths: [clientRoot],
    quietDeps: true
  },

  // `@` alias for Turbopack; the TS side lives in tsconfig `paths`.
  turbopack: {
    resolveAlias: {
      '@': clientRoot
    }
  }
} satisfies NextConfig;

const withNextIntl = createNextIntlPlugin({
  requestConfig: './shared/i18n/request.ts'
});

export default withNextIntl(nextConfig);
