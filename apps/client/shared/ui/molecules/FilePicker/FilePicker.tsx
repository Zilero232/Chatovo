'use client';

import { useFileDialog } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Paperclip, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatBytes } from '@/shared/lib';
import { Button } from '../../atoms/Button';

import s from './FilePicker.module.scss';

import type { FilePickerProps } from './FilePicker.types';

export const FilePicker = ({
  accept,
  className,
  file,
  id,
  placeholder,
  onSelect,
}: FilePickerProps) => {
  const t = useTranslations('common');

  const { open } = useFileDialog(
    (files) => {
      const picked = files?.[0];

      if (picked) {
        onSelect(picked);
      }
    },
    { accept, multiple: false, reset: true },
  );

  return (
    <div className={clsx(s.root, className)} data-slot="file-picker">
      {file ? (
        <div className={s.file}>
          <Paperclip aria-hidden className={s.fileIcon} />
          <span className={s.fileName}>{file.name}</span>
          <span className={s.fileSize}>{formatBytes(file.size)}</span>
          <Button
            aria-label={t('remove')}
            className={s.remove}
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={() => onSelect(undefined)}
          >
            <X />
          </Button>
        </div>
      ) : (
        <button className={s.trigger} id={id} type="button" onClick={() => open()}>
          <Paperclip aria-hidden className={s.triggerIcon} />
          <span>{placeholder ?? t('chooseFile')}</span>
        </button>
      )}
    </div>
  );
};
