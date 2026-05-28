import rootPackage from '../../package.json' with { type: 'json' };
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    // Expose the monorepo root version (e.g. 0.2.4) to the client bundle so
    // the UI can render "v0.2.4" without each workspace's own package.json.
    NEXT_PUBLIC_APP_VERSION: rootPackage.version,
  },
  // Ensure Next.js uses SSG instead of SSR
  // https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
  output: 'export',
  // Auto-memoization — makes manual useMemo/useCallback unnecessary.
  reactCompiler: true,
  // Note: This feature is required to use the Next.js Image component in SSG mode.
  // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
