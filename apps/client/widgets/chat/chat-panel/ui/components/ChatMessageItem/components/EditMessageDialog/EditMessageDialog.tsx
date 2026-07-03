'use client';

import { useKeyboard, useMount, useTextareaAutosize } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { ConfirmDialog } from '@/shared/ui';
import { normalizeMessage } from '../../../../../model/lib';
import { editMessageDialogStyles as s } from './EditMessageDialog.styles';
import type { EditMessageDialogProps } from './EditMessageDialog.types';

export const EditMessageDialog = ({
  open,
  initialValue,
  onOpenChange,
  onSave,
}: EditMessageDialogProps) => {
  const t = useTranslations('chat');
  const normalized = normalizeMessage(initialValue);
  const { ref, value, set } = useTextareaAutosize<HTMLTextAreaElement>(normalized);

  useMount(() => {
    const node = ref.current;

    if (node) {
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  });

  const save = () => {
    const next = value.trim();

    if (next.length === 0 || next === normalized) {
      onOpenChange(false);

      return;
    }

    onSave(next);
    onOpenChange(false);
  };

  useKeyboard(ref, (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      save();
    }
  });

  return (
    <ConfirmDialog
      open={open}
      title={t('editTitle')}
      cancelLabel={t('cancel')}
      confirmLabel={t('save')}
      confirmVariant="default"
      onConfirm={save}
      onOpenChange={onOpenChange}
    >
      <div className={s.root}>
        <textarea
          ref={ref}
          className={s.input}
          rows={1}
          value={value}
          onChange={(event) => set(event.target.value)}
        />
        <p className={s.hint}>{t('editHint')}</p>
      </div>
    </ConfirmDialog>
  );
};
