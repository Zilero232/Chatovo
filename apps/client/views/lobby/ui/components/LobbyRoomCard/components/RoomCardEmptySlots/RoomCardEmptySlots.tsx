'use client';

import { useTranslations } from 'next-intl';

import s from '../../LobbyRoomCard.module.scss';

const EMPTY_SLOTS = ['a', 'b', 'c'];

export const RoomCardEmptySlots = () => {
  const t = useTranslations('lobby.card');

  return (
    <div className={s.emptySlots}>
      <div className={s.emptyAvatars}>
        {EMPTY_SLOTS.map((slot) => (
          <span key={slot} className={s.emptySlot} />
        ))}
      </div>
      <span className={s.emptyJoin}>{t('joinFirst')}</span>
    </div>
  );
};
