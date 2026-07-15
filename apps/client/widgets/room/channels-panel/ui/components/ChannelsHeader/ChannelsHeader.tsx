'use client';

import { clsx } from 'clsx';

import { useCurrentUser } from '@/entities/auth/user';
import { LanguageSwitcher } from '@/widgets/app/language-switcher';

import s from './ChannelsHeader.module.scss';

import type { ChannelsHeaderProps } from './ChannelsHeader.types';

export const ChannelsHeader = ({ compact = false }: ChannelsHeaderProps = {}) => {
  const { isAdmin } = useCurrentUser();

  if (compact) {
    if (!isAdmin) {
      return null;
    }

    return (
      <div className={clsx(s.root, 'surface-bar')}>
        <span aria-hidden className="accent-top-line" />
        <span className={s.adminBadge}>admin</span>
      </div>
    );
  }

  return (
    <div className={clsx(s.root, 'surface-bar')}>
      <span aria-hidden className="accent-top-line" />
      <div className={s.titleGroup}>
        <span className={s.title}>Chatovo</span>
        {isAdmin && <span className={s.adminBadge}>admin</span>}
      </div>

      <LanguageSwitcher />
    </div>
  );
};
