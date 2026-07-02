'use client';

import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui';
import { useChatUnread } from '@/widgets/room/chat';
import { voiceRoomChatButtonStyles as s } from './VoiceRoomChatButton.styles';
import type { VoiceRoomChatButtonProps } from './VoiceRoomChatButton.types';

export const VoiceRoomChatButton = ({ isOpen, onToggle }: VoiceRoomChatButtonProps) => {
  const t = useTranslations('chat');
  const unread = useChatUnread(isOpen);

  return (
    <div className={s.wrap}>
      <Button
        aria-label={isOpen ? t('hide') : t('open')}
        aria-pressed={isOpen}
        className={s.button}
        size="icon-lg"
        type="button"
        variant={isOpen ? 'secondary' : 'ghost'}
        onClick={onToggle}
      >
        <MessageSquare />
      </Button>

      {unread > 0 && !isOpen && (
        <span aria-live="polite" className={cn(s.badge, s.badgePulse)} key={unread}>
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </div>
  );
};
