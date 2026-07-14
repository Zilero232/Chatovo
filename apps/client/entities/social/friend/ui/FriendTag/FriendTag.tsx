'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import s from './FriendTag.module.scss';

import type { FriendTagProps } from './FriendTag.types';

export const FriendTag = ({ tag, className }: FriendTagProps) => {
  const t = useTranslations('friends');

  const { copy } = useCopy();

  const handleCopy = async () => {
    try {
      await copy(tag);

      toast.success(t('tagCopied'));
    } catch {
      toast.error(t('tagCopyFailed'));
    }
  };

  return (
    <button
      aria-label={t('copyTag')}
      className={clsx(s.root, className)}
      type="button"
      onClick={handleCopy}
    >
      <span className={s.value}>{tag}</span>
      <Copy aria-hidden className={s.icon} />
    </button>
  );
};
