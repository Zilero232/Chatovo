'use client';

import { Home } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { prefetchRooms } from '@/entities/room/room';
import { ROUTES } from '@/shared/constants';
import { IconButtonWithTooltip } from '@/shared/ui';
import type { LobbyButtonProps } from './LobbyButton.types';

export const LobbyButton = ({ onNavigate }: LobbyButtonProps = {}) => {
  const t = useTranslations('appSidebar');
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname === ROUTES.lobby;

  const handleClick = () => {
    router.replace(ROUTES.lobby);
    onNavigate?.();
  };

  return (
    <IconButtonWithTooltip
      icon={<Home />}
      label={t('lobby')}
      variant={isActive ? 'secondary' : 'ghost'}
      onClick={handleClick}
      onMouseEnter={prefetchRooms}
    />
  );
};
