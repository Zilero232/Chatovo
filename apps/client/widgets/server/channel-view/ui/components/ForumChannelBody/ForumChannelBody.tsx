'use client';

import { Plus, Tags } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isEmpty } from 'remeda';

import { ThreadTagChip, useThreads, useThreadTags } from '@/entities/server/thread';
import { CreateThreadDialog, ThreadTagsDialog } from '@/features/server/threads';
import { buildServerHref } from '@/shared/lib';
import { Button, CenteredState, Row, ScrollArea } from '@/ui-kit';

import type { ForumChannelBodyProps } from './ForumChannelBody.types';

import { TextChannelBody } from '../TextChannelBody/TextChannelBody';
import { ThreadCard } from '../ThreadCard/ThreadCard';

import s from './ForumChannelBody.module.scss';

export const ForumChannelBody = ({
  channel,
  serverId,
  threadId,
  canCreate,
  canManage,
  canSend
}: ForumChannelBodyProps) => {
  const router = useRouter();

  const t = useTranslations('server.threads');

  const { threads } = useThreads({ channelId: channel.id });
  const { tags, byId } = useThreadTags(channel.id);

  const [createOpen, setCreateOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [activeTagIds, setActiveTagIds] = useState<string[]>([]);

  const openThread = (id: string) =>
    router.push(buildServerHref(serverId, { channelId: channel.id, threadId: id }));

  const toggleTag = (tagId: string) =>
    setActiveTagIds((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]
    );

  const visible = isEmpty(activeTagIds)
    ? threads
    : threads.filter((thread) => activeTagIds.every((tagId) => thread.tagIds.includes(tagId)));

  if (threadId) {
    return (
      <TextChannelBody
        canModerate={canManage}
        canSend={canSend}
        channel={channel}
        serverId={serverId}
        threadId={threadId}
      />
    );
  }

  return (
    <ScrollArea className={s.root}>
      <div className={s.toolbar}>
        {!isEmpty(tags) && (
          <Row wrap className={s.filters} gap='1'>
            {tags.map((tag) => (
              <ThreadTagChip
                key={tag.id}
                isActive={activeTagIds.includes(tag.id)}
                tag={tag}
                onToggle={toggleTag}
              />
            ))}
          </Row>
        )}

        <Row gap='2'>
          {canManage && (
            <Button size='sm' type='button' variant='ghost' onClick={() => setTagsOpen(true)}>
              <Tags />
              {t('manageTags')}
            </Button>
          )}
          {canCreate && (
            <Button size='sm' type='button' onClick={() => setCreateOpen(true)}>
              <Plus />
              {t('create')}
            </Button>
          )}
        </Row>
      </div>

      {isEmpty(visible) ? (
        <CenteredState pattern='waves' size='sm' title={t('empty')} />
      ) : (
        <div className={s.grid}>
          {visible.map((thread) => (
            <ThreadCard
              key={thread.id}
              canManage={canManage}
              isActive={false}
              tagsById={byId}
              thread={thread}
              onOpen={() => openThread(thread.id)}
            />
          ))}
        </div>
      )}

      <CreateThreadDialog
        channelId={channel.id}
        open={createOpen}
        onCreated={openThread}
        onOpenChange={setCreateOpen}
      />

      <ThreadTagsDialog channelId={channel.id} open={tagsOpen} onOpenChange={setTagsOpen} />
    </ScrollArea>
  );
};
