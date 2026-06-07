'use client';

import { useKeyboard, useMount, useTextareaAutosize } from '@siberiacancode/reactuse';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui';
import { messageEditorStyles as s } from './MessageEditor.styles';
import type { MessageEditorProps } from './MessageEditor.types';

export const MessageEditor = ({ initialValue, onSave, onCancel }: MessageEditorProps) => {
  const t = useTranslations('chat');
  const { ref, value, set } = useTextareaAutosize<HTMLTextAreaElement>(initialValue);

  useMount(() => {
    const node = ref.current;

    if (node) {
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  });

  const save = () => {
    const next = value.trim();

    if (next.length === 0 || next === initialValue.trim()) {
      onCancel();

      return;
    }

    onSave(next);
  };

  useKeyboard(ref, (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();

      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      save();
    }
  });

  return (
    <div className={s.root}>
      <textarea
        ref={ref}
        className={s.input}
        rows={1}
        value={value}
        onChange={(event) => set(event.target.value)}
      />
      <p className={s.hint}>{t('editHint')}</p>
      <div className={s.actions}>
        <Button
          aria-label={t('cancel')}
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          <X />
        </Button>
        <Button aria-label={t('save')} size="icon-sm" type="button" onClick={save}>
          <Check />
        </Button>
      </div>
    </div>
  );
};
