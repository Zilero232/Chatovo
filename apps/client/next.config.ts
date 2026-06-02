import rootPackage from '../../package.json' with { type: 'json' };
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: rootPackage.version,
  },
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
