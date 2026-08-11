'use client';

import { clsx } from 'clsx';

import type { ChannelsPanelProps } from './ChannelsPanel.types';

import { ChannelsFooter, ChannelsFriends, ChannelsHeader, ChannelsList } from './components';

import s from './ChannelsPanel.module.scss';

export const ChannelsPanel = ({ variant = 'desktop', onNavigate }: ChannelsPanelProps = {}) => (
  <div
    className={clsx(
      s.root,
      variant === 'desktop' ? s.desktop : s.drawer,
      variant === 'desktop' && 'surface-bar'
    )}
    data-variant={variant}
  >
    <ChannelsHeader compact={variant === 'drawer'} />
    <ChannelsList footer={<ChannelsFriends onNavigate={onNavigate} />} onNavigate={onNavigate} />
    <ChannelsFooter />
  </div>
);
