'use client';

import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui';

import s from '../ShortcutRow.module.scss';

type ShortcutClearButtonProps = {
  visible: boolean;
  onClick: () => void;
};

export const ShortcutClearButton = ({ visible, onClick }: ShortcutClearButtonProps) => {
  const t = useTranslations('settings.shortcuts');

  return (
    <Button
      aria-hidden={!visible}
      aria-label={t('clear')}
      className={clsx({ [s.hidden]: !visible })}
      size="icon"
      tabIndex={visible ? 0 : -1}
      type="button"
      variant="ghost"
      onClick={onClick}
    >
      <X />
    </Button>
  );
};
