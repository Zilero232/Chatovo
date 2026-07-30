'use client';

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/shared/ui';

import type { MessageContextMenuProps } from './MessageContextMenu.types';

import { MessageMenuItems } from '../MessageMenuItems';

import s from './MessageContextMenu.module.scss';

export const MessageContextMenu = ({
  children,
  enabled,
  canEdit,
  onEdit,
  onDelete
}: MessageContextMenuProps) => {
  if (!enabled) {
    return children;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className={s.content}>
        <MessageMenuItems canEdit={canEdit} onDelete={onDelete} onEdit={onEdit} />
      </ContextMenuContent>
    </ContextMenu>
  );
};
