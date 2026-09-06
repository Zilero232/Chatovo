'use client';

import { Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants';
import { Button, Tooltip, TooltipContent } from '@/ui-kit';

import type { LobbyButtonProps } from './LobbyButton.types';

export const LobbyButton = ({ side = 'right', onNavigate }: LobbyButtonProps) => {
  const t = useTranslations('appSidebar');
  const router = useRouter();
  const pathname = usePathname();

  const isLobby = pathname === ROUTES.lobby;

  return (
    <Tooltip>
      <Button
        aria-current={isLobby ? 'page' : undefined}
        aria-label={t('lobby')}
        size='icon'
        variant='ghost'
        onClick={() => {
          router.push(ROUTES.lobby);
          onNavigate?.();
        }}
      >
        <Home />
      </Button>
      <TooltipContent side={side}>{t('lobby')}</TooltipContent>
    </Tooltip>
  );
};
