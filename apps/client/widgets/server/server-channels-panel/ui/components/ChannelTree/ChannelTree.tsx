'use client';

import { closestCenter, DndContext } from '@dnd-kit/core';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import { CenteredState, ScrollArea, Skeleton } from '@/ui-kit';

import type { ChannelTreeProps } from './ChannelTree.types';

import { useChannelDnd, useCollapsedCategories } from '../../../model/hooks';
import { ChannelGroup } from '../ChannelGroup/ChannelGroup';

import s from './ChannelTree.module.scss';

const SKELETON_KEYS = ['a', 'b', 'c', 'd', 'e', 'f'] as const;

export const ChannelTree = ({
  serverId,
  groups,
  activeChannelId,
  canManageChannels,
  isLoading,
  onNavigate
}: ChannelTreeProps) => {
  const t = useTranslations('server.channels');

  const { isCollapsed, toggle } = useCollapsedCategories(serverId);
  const { sensors, onDragEnd } = useChannelDnd({
    serverId,
    groups,
    enabled: canManageChannels
  });

  if (isLoading) {
    return (
      <div className={s.skeletons}>
        {SKELETON_KEYS.map((key) => (
          <Skeleton key={key} className={s.skeleton} />
        ))}
      </div>
    );
  }

  if (isEmpty(groups)) {
    return <CenteredState description={t('emptyHint')} size='sm' title={t('empty')} />;
  }

  return (
    <ScrollArea className={s.scroll}>
      <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
        <div className={s.list}>
          {groups.map((group) => {
            const categoryId = group.category?.id ?? null;

            return (
              <ChannelGroup
                key={categoryId ?? 'uncategorized'}
                activeChannelId={activeChannelId}
                canManage={canManageChannels}
                collapsed={categoryId ? isCollapsed(categoryId) : false}
                group={group}
                serverId={serverId}
                onNavigate={onNavigate}
                onToggle={() => categoryId && toggle(categoryId)}
              />
            );
          })}
        </div>
      </DndContext>
    </ScrollArea>
  );
};
