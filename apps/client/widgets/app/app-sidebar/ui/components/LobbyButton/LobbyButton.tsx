'use client';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/shared/constants';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import type { LobbyButtonProps } from './LobbyButton.types';

export const LobbyButton = ({ onNavigate }: LobbyButtonProps = {}) => {
  const t = useTranslations('appSidebar');
  const router = useRouter();

  const handleClick = () => {
    router.replace(ROUTES.lobby);
    onNavigate?.();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label={t('lobby')} size="icon" variant="ghost" onClick={handleClick}>
          <Home />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{t('lobby')}</TooltipContent>
    </Tooltip>
  );
};
