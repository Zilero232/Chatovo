'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

import s from './ToggleChannelsButton.module.scss';

import type { ToggleChannelsButtonProps } from './ToggleChannelsButton.types';

export const ToggleChannelsButton = ({ opened, onToggle }: ToggleChannelsButtonProps) => {
  const t = useTranslations('appSidebar');

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button aria-label={t('toggleChannels')} size="icon" variant="ghost" onClick={onToggle}>
          {opened ? (
            <PanelLeftClose key="close" className={s.iconEnter} />
          ) : (
            <PanelLeftOpen key="open" className={s.iconEnter} />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{opened ? t('hideChannels') : t('showChannels')}</TooltipContent>
    </Tooltip>
  );
};
