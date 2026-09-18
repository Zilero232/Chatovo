'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isEmpty } from 'remeda';

import { useThreads, useThreadTags } from '@/entities/server/thread';
import { CreateThreadDialog } from '@/features/server/threads';
import { buildServerHref } from '@/shared/lib';
import { Button, ScrollArea, Switch, Text } from '@/ui-kit';

import type { ThreadsPanelProps } from './ThreadsPanel.types';

import { ThreadCard } from '../ThreadCard/ThreadCard';

import s from './ThreadsPanel.module.scss';

export const ThreadsPanel = ({
  channel,
  serverId,
  threadId,
  canCreate,
  canManage
}: ThreadsPanelProps) => {
  const router = useRouter();

  const t = useTranslations('server.threads');

  const [archived, setArchived] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { threads } = useThreads({ channelId: channel.id, archived });
  const { byId } = useThreadTags(channel.id);

  const openThread = (id: string) =>
    router.push(buildServerHref(serverId, { channelId: channel.id, threadId: id }));

  return (
    <aside className={s.root}>
      <div className={s.header}>
        <Text weight='semibold'>{t('title')}</Text>
        {canCreate && (
          <Button
            aria-label={t('create')}
            size='icon-sm'
            type='button'
            variant='ghost'
            onClick={() => setCreateOpen(true)}
          >
            <Plus />
          </Button>
        )}
      </div>

      <label className={s.archived}>
        <Text size='xs' tone='muted'>
          {t('showArchived')}
        </Text>
        <Switch checked={archived} onCheckedChange={setArchived} />
      </label>

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {isEmpty(threads) && (
            <Text size='sm' tone='muted'>
              {t('empty')}
            </Text>
          )}
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              canManage={canManage}
              isActive={thread.id === threadId}
              tagsById={byId}
              thread={thread}
              onOpen={() => openThread(thread.id)}
            />
          ))}
        </div>
      </ScrollArea>

      <CreateThreadDialog
        channelId={channel.id}
        open={createOpen}
        onCreated={openThread}
        onOpenChange={setCreateOpen}
      />
    </aside>
  );
};
