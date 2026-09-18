'use client';

import { clsx } from 'clsx';
import { ArrowLeft, MessagesSquare, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ChannelIcon } from '@/entities/server/channel';
import { buildServerHref } from '@/shared/lib';
import { IconButtonWithTooltip, Text } from '@/ui-kit';

import type { ChannelHeaderProps } from './ChannelHeader.types';

import { PinnedMessagesPopover } from '../PinnedMessagesPopover/PinnedMessagesPopover';

import s from './ChannelHeader.module.scss';

export const ChannelHeader = ({
  channel,
  serverId,
  threadId,
  sidePanel,
  onTogglePanel
}: ChannelHeaderProps) => {
  const router = useRouter();

  const t = useTranslations('server.channels');

  const isText = channel.type !== 'voice';
  const supportsThreads = channel.type === 'text' || channel.type === 'announcement';

  return (
    <header className={clsx('surface-bar', s.root)}>
      <span aria-hidden className='accent-top-line' />

      {threadId && (
        <IconButtonWithTooltip
          icon={<ArrowLeft />}
          label={t('backToChannel')}
          tooltipSide='bottom'
          type='button'
          onClick={() => router.push(buildServerHref(serverId, { channelId: channel.id }))}
        />
      )}

      <ChannelIcon className={s.icon} type={channel.type} />

      <div className={s.title}>
        <span className={s.name}>{channel.name}</span>
        {channel.topic && (
          <Text truncate className={s.topic} size='xs' tone='muted'>
            {channel.topic}
          </Text>
        )}
      </div>

      <div className={s.actions}>
        {isText && <PinnedMessagesPopover roomId={channel.id} />}
        {supportsThreads && (
          <IconButtonWithTooltip
            aria-pressed={sidePanel === 'threads'}
            className={clsx({ [s.activeAction]: sidePanel === 'threads' })}
            icon={<MessagesSquare />}
            label={t('threads')}
            tooltipSide='bottom'
            type='button'
            onClick={() => onTogglePanel('threads')}
          />
        )}
        <IconButtonWithTooltip
          aria-pressed={sidePanel === 'members'}
          className={clsx({ [s.activeAction]: sidePanel === 'members' })}
          icon={<Users />}
          label={t('members')}
          tooltipSide='bottom'
          type='button'
          onClick={() => onTogglePanel('members')}
        />
      </div>
    </header>
  );
};
