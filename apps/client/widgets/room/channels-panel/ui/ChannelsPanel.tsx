'use client';

import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/shared/constants';
import { ChannelsFooter, ChannelsHeader, ChannelsList, ChannelsLobbyBanner } from './components';

import s from './ChannelsPanel.module.scss';

import type { ChannelsPanelProps } from './ChannelsPanel.types';

export const ChannelsPanel = ({ variant = 'desktop', onNavigate }: ChannelsPanelProps = {}) => {
  const isLobby = usePathname() === ROUTES.lobby;

  return (
    <div
      className={clsx(
        s.root,
        variant === 'desktop' ? s.desktop : s.drawer,
        variant === 'desktop' && 'surface-bar',
      )}
      data-variant={variant}
    >
      <ChannelsHeader compact={variant === 'drawer'} />
      {isLobby ? <ChannelsLobbyBanner /> : <ChannelsList onNavigate={onNavigate} />}
      <ChannelsFooter />
    </div>
  );
};
