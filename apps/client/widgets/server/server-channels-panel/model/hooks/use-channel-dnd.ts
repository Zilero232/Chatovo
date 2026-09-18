'use client';

import type { DragEndEvent } from '@dnd-kit/core';

import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { isNullish } from 'remeda';

import type { ChannelGroup } from '@/entities/server/channel';

import { useToastError } from '@/entities/app/locale';
import { useReorderChannels } from '@/entities/server/channel';

export const groupDroppableId = (categoryId: string | null) => `group:${categoryId ?? 'none'}`;

const findGroup = (groups: ChannelGroup[], id: string) =>
  groups.find(
    (group) =>
      groupDroppableId(group.category?.id ?? null) === id ||
      group.channels.some((channel) => channel.id === id)
  );

export const useChannelDnd = ({
  serverId,
  groups,
  enabled
}: {
  serverId: string;
  groups: ChannelGroup[];
  enabled: boolean;
}) => {
  const toastError = useToastError();
  const reorderMutation = useReorderChannels(serverId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!enabled || isNullish(over) || active.id === over.id) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    const source = findGroup(groups, activeId);
    const target = findGroup(groups, overId);
    const moving = source?.channels.find((channel) => channel.id === activeId);

    if (isNullish(source) || isNullish(target) || isNullish(moving)) {
      return;
    }

    const sourceRest = source.channels.filter((channel) => channel.id !== activeId);
    const targetBase = source === target ? sourceRest : target.channels;
    const overIndex = targetBase.findIndex((channel) => channel.id === overId);
    const insertAt = overIndex < 0 ? targetBase.length : overIndex;
    const targetNext = [...targetBase.slice(0, insertAt), moving, ...targetBase.slice(insertAt)];

    const targetCategoryId = target.category?.id ?? null;
    const sourceCategoryId = source.category?.id ?? null;

    const changes = targetNext.map((channel, position) => ({
      id: channel.id,
      position,
      categoryId: targetCategoryId
    }));

    const sourceChanges =
      source === target
        ? []
        : sourceRest.map((channel, position) => ({
            id: channel.id,
            position,
            categoryId: sourceCategoryId
          }));

    reorderMutation.mutate(
      { channels: [...changes, ...sourceChanges] },
      { onError: toastError(`channel-dnd-${serverId}`) }
    );
  };

  return { sensors, onDragEnd };
};
