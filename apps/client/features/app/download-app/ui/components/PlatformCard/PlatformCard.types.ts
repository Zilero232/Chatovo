import type { LucideIcon } from 'lucide-react';

import type { ReleaseAsset } from '@/entities/app/release';

export type PlatformCardProps = {
  Icon: LucideIcon;
  label: string;
  asset?: ReleaseAsset;
  href?: string;
  isWide?: boolean;
};
