'use client';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/shared/constants';
import { IconButtonWithTooltip } from '@/shared/ui';
import type { LobbyButtonProps } from './LobbyButton.types';

export const LobbyButton = ({ onNavigate }: LobbyButtonProps = {}) => {
  const t = useTranslations('appSidebar');
  const router = useRouter();

  const handleClick = () => {
    router.replace(ROUTES.lobby);
    onNavigate?.();
  };

  return <IconButtonWithTooltip icon={<Home />} label={t('lobby')} onClick={handleClick} />;
};
