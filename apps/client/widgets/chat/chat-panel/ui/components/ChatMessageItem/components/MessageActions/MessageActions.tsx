'use client';

import { CornerDownRight, Pencil, Pin, PinOff, SmilePlus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { QUICK_REACTIONS } from '@/shared/config';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/ui-kit';

import { useChatMessage } from '../../../../../model/contexts';

import s from './MessageActions.module.scss';

export const MessageActions = () => {
  const t = useTranslations('chat');
  const {
    canEdit,
    canPin,
    canReact,
    canReply,
    hasReactedWith,
    isPinned,
    showActions,
    startEdit,
    requestDelete,
    reply,
    togglePin,
    toggleReaction
  } = useChatMessage();

  if (!canReact && !canReply && !canEdit && !canPin && !showActions) {
    return null;
  }

  return (
    <div className={s.root}>
      {canReact && (
        <Popover>
          <PopoverTrigger aria-label={t('addReaction')} size='icon-xs' variant='ghost'>
            <SmilePlus />
          </PopoverTrigger>
          <PopoverContent align='end' className={s.picker}>
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                aria-label={t('reactWith', { emoji })}
                aria-pressed={hasReactedWith(emoji)}
                className={s.pickerItem}
                type='button'
                onClick={() => toggleReaction(emoji, hasReactedWith(emoji))}
              >
                {emoji}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}

      {canReply && (
        <Button aria-label={t('reply')} size='icon-xs' variant='ghost' onClick={reply}>
          <CornerDownRight />
        </Button>
      )}

      {canEdit && (
        <Button aria-label={t('edit')} size='icon-xs' variant='ghost' onClick={startEdit}>
          <Pencil />
        </Button>
      )}

      {canPin && (
        <Button
          aria-label={isPinned ? t('unpin') : t('pin')}
          size='icon-xs'
          variant='ghost'
          onClick={togglePin}
        >
          {isPinned ? <PinOff /> : <Pin />}
        </Button>
      )}

      {showActions && (
        <Button aria-label={t('delete')} size='icon-xs' variant='ghost' onClick={requestDelete}>
          <Trash2 />
        </Button>
      )}
    </div>
  );
};
