'use client';

import { useState } from 'react';
import { match } from 'ts-pattern';

import { canInChannel } from '@/entities/server/channel';

import type { ChannelSidePanel, ChannelViewProps } from './ChannelView.types';

import { useMarkReadOnView } from '../model/hooks';
import {
  ChannelHeader,
  ForumChannelBody,
  MembersPanel,
  TextChannelBody,
  ThreadsPanel,
  VoiceChannelBody
} from './components';

import s from './ChannelView.module.scss';

export const ChannelView = ({ serverId, channel, threadId, tree }: ChannelViewProps) => {
  const [sidePanel, setSidePanel] = useState<ChannelSidePanel>(null);

  useMarkReadOnView({ serverId, channelId: channel.id });

  const can = (permission: Parameters<typeof canInChannel>[2]) =>
    canInChannel(tree, channel.id, permission);

  const togglePanel = (panel: Exclude<ChannelSidePanel, null>) =>
    setSidePanel((current) => (current === panel ? null : panel));

  return (
    <div className={s.root}>
      <ChannelHeader
        channel={channel}
        serverId={serverId}
        sidePanel={sidePanel}
        threadId={threadId}
        onTogglePanel={togglePanel}
      />

      <div className={s.body}>
        <div className={s.main}>
          {match(channel.type)
            .with('voice', () => <VoiceChannelBody channel={channel} />)
            .with('forum', () => (
              <ForumChannelBody
                canCreate={can('createThreads')}
                canManage={can('manageThreads')}
                canSend={can('sendMessagesInThreads')}
                channel={channel}
                serverId={serverId}
                threadId={threadId}
              />
            ))
            .otherwise(() => (
              <TextChannelBody
                canModerate={can('manageMessages')}
                canSend={can(threadId ? 'sendMessagesInThreads' : 'sendMessages')}
                channel={channel}
                serverId={serverId}
                threadId={threadId}
              />
            ))}
        </div>

        {sidePanel === 'members' && <MembersPanel serverId={serverId} />}
        {sidePanel === 'threads' && (
          <ThreadsPanel
            canCreate={can('createThreads')}
            canManage={can('manageThreads')}
            channel={channel}
            serverId={serverId}
            threadId={threadId}
          />
        )}
      </div>
    </div>
  );
};
