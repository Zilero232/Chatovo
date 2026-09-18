'use client';

import { useTranslations } from 'next-intl';

import { FriendsDialog } from '@/widgets/social/friends-dialog';

import s from './ChannelsSearch.module.scss';

export const ChannelsSearch = () => {
  const t = useTranslations('channels');

  return (
    <div className={s.root}>
      <FriendsDialog
        renderTrigger={({ onOpen }) => (
          <button className={s.trigger} type='button' onClick={onOpen}>
            {t('findOrStart')}
          </button>
        )}
      />
    </div>
  );
};
