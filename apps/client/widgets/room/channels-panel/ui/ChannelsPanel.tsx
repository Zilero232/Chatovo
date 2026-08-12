'use client';

import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/shared/constants';

import type { ChannelsPanelProps } from './ChannelsPanel.types';

import {
  ChannelsActivity,
  ChannelsFooter,
  ChannelsFriends,
  ChannelsHeader,
  ChannelsList
} from './components';

import s from './ChannelsPanel.module.scss';

export const ChannelsPanel = ({ variant = 'desktop', onNavigate }: ChannelsPanelProps = {}) => {
  const pathname = usePathname();

  const isLobby = pathname === ROUTES.lobby;

  return (
    <div
      className={clsx(
        s.root,
        variant === 'desktop' ? s.desktop : s.drawer,
        variant === 'desktop' && 'surface-bar'
      )}
      data-variant={variant}
    >
      <ChannelsHeader compact={variant === 'drawer'} />

      {isLobby ? (
        <ChannelsActivity onNavigate={onNavigate} />
      ) : (
        <ChannelsList
          footer={<ChannelsFriends onNavigate={onNavigate} />}
          onNavigate={onNavigate}
        />
      )}

      <ChannelsFooter />
    </div>
  );
};
