'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { clsx } from 'clsx';
import { isEmpty } from 'remeda';

import type { ChannelGroupProps } from './ChannelGroup.types';

import { groupDroppableId } from '../../../model/hooks';
import { CategoryRow } from '../CategoryRow/CategoryRow';
import { ChannelSection } from '../ChannelSection/ChannelSection';

import s from './ChannelGroup.module.scss';

export const ChannelGroup = ({
  group,
  serverId,
  activeChannelId,
  canManage,
  collapsed,
  onToggle,
  onNavigate
}: ChannelGroupProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: groupDroppableId(group.category?.id ?? null),
    disabled: !canManage
  });

  const visible = collapsed
    ? group.channels.filter((channel) => channel.id === activeChannelId)
    : group.channels;

  const textChannels = visible.filter((channel) => channel.type !== 'voice');
  const voiceChannels = visible.filter((channel) => channel.type === 'voice');

  return (
    <section ref={setNodeRef} className={clsx(s.root, { [s.over]: isOver })}>
      {group.category && (
        <CategoryRow
          canManage={canManage}
          category={group.category}
          collapsed={collapsed}
          serverId={serverId}
          onToggle={onToggle}
        />
      )}

      <SortableContext
        items={group.channels.map((channel) => channel.id)}
        strategy={verticalListSortingStrategy}
      >
        {!isEmpty(textChannels) && (
          <ChannelSection
            activeChannelId={activeChannelId}
            canManage={canManage}
            categoryId={group.category?.id ?? null}
            channels={textChannels}
            kind='text'
            serverId={serverId}
            onNavigate={onNavigate}
          />
        )}

        {!isEmpty(voiceChannels) && (
          <ChannelSection
            activeChannelId={activeChannelId}
            canManage={canManage}
            categoryId={group.category?.id ?? null}
            channels={voiceChannels}
            kind='voice'
            serverId={serverId}
            onNavigate={onNavigate}
          />
        )}
      </SortableContext>
    </section>
  );
};
