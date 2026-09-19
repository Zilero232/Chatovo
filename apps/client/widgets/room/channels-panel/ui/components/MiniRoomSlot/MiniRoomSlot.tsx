'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';

import { useMiniRoomSlot } from '@/entities/room/session';

import s from './MiniRoomSlot.module.scss';

export const MiniRoomSlot = () => {
  const { setDockedSlot } = useMiniRoomSlot();

  const isDesktop = useMediaQuery('(min-width: 48rem)');

  if (!isDesktop) {
    return null;
  }

  return <div ref={setDockedSlot} className={s.root} />;
};
