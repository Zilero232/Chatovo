'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import type { ToggleChannelsButtonProps } from './ToggleChannelsButton.types';

export const ToggleChannelsButton = ({ opened, onToggle }: ToggleChannelsButtonProps) => {
  const t = useTranslations('appSidebar');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label={t('toggleChannels')} size="icon" variant="ghost" onClick={onToggle}>
          {opened ? (
            <PanelLeftClose key="close" className="fade-in zoom-in-75 animate-in duration-200" />
          ) : (
            <PanelLeftOpen key="open" className="fade-in zoom-in-75 animate-in duration-200" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{opened ? t('hideChannels') : t('showChannels')}</TooltipContent>
    </Tooltip>
  );
};
