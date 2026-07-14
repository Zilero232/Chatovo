'use client';

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/shared/ui';
import { MessageMenuItems } from '../MessageMenuItems';
import s from './MessageContextMenu.module.scss';
import type { MessageContextMenuProps } from './MessageContextMenu.types';

export const MessageContextMenu = ({
  children,
  enabled,
  canEdit,
  onEdit,
  onDelete,
}: MessageContextMenuProps) => {
  if (!enabled) {
    return children;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className={s.content}>
        <MessageMenuItems canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} />
      </ContextMenuContent>
    </ContextMenu>
  );
};
