'use client';

import { clsx } from 'clsx';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants';

import type { ChannelsHomeProps } from './ChannelsHome.types';

import s from './ChannelsHome.module.scss';

export const ChannelsHome = ({ onNavigate }: ChannelsHomeProps = {}) => {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('lobby.tabs');

  const isActive = pathname === ROUTES.lobby;

  return (
    <div className={s.root}>
      <button
        aria-current={isActive ? 'page' : undefined}
        className={clsx(s.item, { [s.active]: isActive })}
        type='button'
        onClick={() => {
          router.push(ROUTES.lobby);
          onNavigate?.();
        }}
      >
        <Users aria-hidden className={s.icon} />
        {t('friends')}
      </button>
    </div>
  );
};
