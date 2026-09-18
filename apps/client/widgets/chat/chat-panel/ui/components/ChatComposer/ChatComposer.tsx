'use client';

import { useKeyboard, useTextareaAutosize } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Plus, SendHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isNonNullish } from 'remeda';

import { Button, Spinner } from '@/ui-kit';

import type { ChatComposerProps } from './ChatComposer.types';

import { useMentionAutocomplete } from '../../../model/hooks';
import { ComposerMentionPopup, ComposerReplyBar } from './components';

import s from './ChatComposer.module.scss';

export const ChatComposer = ({
  isUploading,
  replyTo,
  serverId = null,
  onSend,
  onAttach,
  onPaste,
  onTyping,
  onCancelReply
}: ChatComposerProps) => {
  const t = useTranslations('chat');
  const { ref, value: draft, set } = useTextareaAutosize<HTMLTextAreaElement>('');

  const mentions = useMentionAutocomplete({ serverId, textareaRef: ref, onChange: set });

  const busy = isUploading;

  const submit = async () => {
    const value = draft.trim();

    if (!value || busy) {
      return;
    }

    set('');
    mentions.close();
    ref.current?.focus();

    await onSend(value);
  };

  useKeyboard(ref, (event) => {
    if (mentions.isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        mentions.moveActive(event.key === 'ArrowDown' ? 1 : -1);

        return;
      }

      if (event.key === 'Enter' || event.key === 'Tab') {
        const candidate = mentions.candidates[mentions.activeIndex];

        if (candidate) {
          event.preventDefault();
          mentions.pick(candidate);

          return;
        }
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        mentions.close();

        return;
      }
    }

    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    submit();
  });

  const canSend = draft.trim().length > 0 && !busy;

  return (
    <form
      className={clsx('surface-bar', s.root)}
      onSubmit={(event) => {
        event.preventDefault();

        submit();
      }}
    >
      <span aria-hidden className='accent-top-line' />

      {isNonNullish(replyTo) && onCancelReply && (
        <ComposerReplyBar replyTo={replyTo} onCancel={onCancelReply} />
      )}

      {mentions.isOpen && (
        <ComposerMentionPopup
          activeIndex={mentions.activeIndex}
          candidates={mentions.candidates}
          onPick={mentions.pick}
        />
      )}

      <div className={s.row}>
        <Button
          aria-label={t('attach')}
          disabled={busy}
          size='icon-sm'
          type='button'
          variant='ghost'
          onClick={onAttach}
        >
          {isUploading ? <Spinner /> : <Plus />}
        </Button>

        <textarea
          ref={ref}
          className={clsx(s.input, 'scrollbar-none')}
          placeholder={isUploading ? t('uploading') : t('messagePlaceholder')}
          rows={1}
          value={draft}
          onChange={(event) => {
            set(event.target.value);
            mentions.sync(event.target.value);
            onTyping?.();
          }}
          onPaste={onPaste}
        />

        <Button
          aria-label={t('send')}
          className={clsx({ [s.sendActive]: canSend })}
          disabled={!canSend}
          size='icon-sm'
          type='submit'
          variant='ghost'
        >
          <SendHorizontal className={clsx({ [s.sendIconActive]: canSend })} />
        </Button>
      </div>
    </form>
  );
};
