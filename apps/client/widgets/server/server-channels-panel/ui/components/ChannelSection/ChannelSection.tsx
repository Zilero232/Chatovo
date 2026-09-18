'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ChannelDialog } from '@/features/server/manage-channel';
import { Button } from '@/ui-kit';

import type { ChannelSectionProps } from './ChannelSection.types';

import { ChannelRow } from '../ChannelRow/ChannelRow';

import s from './ChannelSection.module.scss';

export const ChannelSection = ({
  kind,
  channels,
  serverId,
  categoryId,
  activeChannelId,
  canManage,
  onNavigate
}: ChannelSectionProps) => {
  const t = useTranslations('server.channels');

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className={s.root}>
      <div className={s.header}>
        <span className={s.label}>{t(kind === 'voice' ? 'voiceChannels' : 'textChannels')}</span>

        {canManage && (
          <Button
            aria-label={t('createChannel')}
            className={s.add}
            size='icon-xs'
            type='button'
            variant='ghost'
            onClick={() => setCreateOpen(true)}
          >
            <Plus />
          </Button>
        )}
      </div>

      {channels.map((channel, index) => (
        <ChannelRow
          key={channel.id}
          canManage={canManage}
          channel={channel}
          isActive={channel.id === activeChannelId}
          serverId={serverId}
          siblingIndex={index}
          siblings={channels}
          onNavigate={onNavigate}
        />
      ))}

      <ChannelDialog
        categoryId={categoryId}
        open={createOpen}
        serverId={serverId}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
};
