'use client';

import s from '../../LobbyRoomCard.module.scss';

const EMPTY_SLOTS = ['a', 'b', 'c'];

export const RoomCardEmptySlots = () => (
  <div className={s.emptySlots}>
    <div className={s.emptyAvatars}>
      {EMPTY_SLOTS.map((slot) => (
        <span key={slot} className={s.emptySlot} />
      ))}
    </div>
  </div>
);
