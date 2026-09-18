'use client';

import { clsx } from 'clsx';
import { UserPlus, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import type { LobbyHeaderBarProps } from './LobbyHeaderBar.types';

import { LOBBY_NAV_TABS } from './LobbyHeaderBar.config';

import s from './LobbyHeaderBar.module.scss';

export const LobbyHeaderBar = ({ tab, onTabChange }: LobbyHeaderBarProps) => {
  const t = useTranslations('lobby.tabs');

  return (
    <header className={clsx('surface-bar', s.root)}>
      <span aria-hidden className='accent-top-line' />

      <span className={s.title}>
        <Users aria-hidden className={s.titleIcon} />
        {t('friends')}
      </span>

      <span aria-hidden className={s.divider} />

      <nav className={s.tabs}>
        {LOBBY_NAV_TABS.map((value) => (
          <button
            key={value}
            aria-pressed={tab === value}
            className={clsx(s.tab, { [s.tabActive]: tab === value })}
            type='button'
            onClick={() => onTabChange(value)}
          >
            {t(value)}
          </button>
        ))}

        <Button
          className={s.addFriend}
          size='sm'
          type='button'
          variant={tab === 'add' ? 'primary' : 'default'}
          onClick={() => onTabChange('add')}
        >
          <UserPlus />
          {t('addFriend')}
        </Button>
      </nav>
    </header>
  );
};
