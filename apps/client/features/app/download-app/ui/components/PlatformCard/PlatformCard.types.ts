import type { LucideIcon } from 'lucide-react';

import type { ReleaseAsset } from '@/entities/app/release';

export type PlatformCardProps = {
  asset?: ReleaseAsset;
  Icon: LucideIcon;
  label: string;
};
