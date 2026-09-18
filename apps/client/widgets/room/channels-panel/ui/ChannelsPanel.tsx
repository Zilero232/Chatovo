'use client';

import { clsx } from 'clsx';

import type { ChannelsPanelProps } from './ChannelsPanel.types';

import {
  ChannelsFooter,
  ChannelsSearch,
  ChannelsShortcuts,
  DirectMessages,
  VoiceStatusBar
} from './components';

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
    <ChannelsSearch />

    <ChannelsShortcuts onNavigate={onNavigate} />

    <DirectMessages onNavigate={onNavigate} />

    <VoiceStatusBar />

    <ChannelsFooter />
  </div>
);
