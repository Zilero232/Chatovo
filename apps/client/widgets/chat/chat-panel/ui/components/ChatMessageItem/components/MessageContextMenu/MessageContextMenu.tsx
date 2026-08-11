'use client';

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/shared/ui';

import type { MessageContextMenuProps } from './MessageContextMenu.types';

import { useChatMessage } from '../../../../../model/contexts';
import { MessageMenuItems } from '../MessageMenuItems';

import s from './MessageContextMenu.module.scss';

export const MessageContextMenu = ({ children }: MessageContextMenuProps) => {
  const { showActions } = useChatMessage();

  if (!showActions) {
    return children;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className={s.content}>
        <MessageMenuItems />
      </ContextMenuContent>
    </ContextMenu>
  );
};
