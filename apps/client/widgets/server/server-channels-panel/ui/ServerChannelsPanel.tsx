'use client';

import { clsx } from 'clsx';

import { ChannelsFooter, VoiceStatusBar } from '@/widgets/room/channels-panel';

import type { ServerChannelsPanelProps } from './ServerChannelsPanel.types';

import { useServerPanel } from '../model/hooks';
import { ChannelTree, ServerHeader } from './components';

import s from './ServerChannelsPanel.module.scss';

export const ServerChannelsPanel = ({
  variant = 'desktop',
  onNavigate
}: ServerChannelsPanelProps = {}) => {
  const { serverId, activeChannelId, server, tree, groups, isLoading, canManageChannels } =
    useServerPanel();

  if (!serverId) {
    return null;
  }

  return (
    <div
      className={clsx(
        s.root,
        variant === 'desktop' ? s.desktop : s.drawer,
        variant === 'desktop' && 'surface-bar'
      )}
      data-variant={variant}
    >
      <ServerHeader server={server} serverId={serverId} tree={tree} />

      <ChannelTree
        activeChannelId={activeChannelId}
        canManageChannels={canManageChannels}
        groups={groups}
        isLoading={isLoading}
        serverId={serverId}
        onNavigate={onNavigate}
      />

      <VoiceStatusBar />

      <ChannelsFooter />
    </div>
  );
};
