'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';

import { useMiniRoomSlot } from '@/entities/room/session';

import s from './MiniRoomFloatingSlot.module.scss';

export const MiniRoomFloatingSlot = () => {
  const { setFloatingSlot } = useMiniRoomSlot();

  const isDesktop = useMediaQuery('(min-width: 48rem)');

  if (isDesktop) {
    return null;
  }

  return <div ref={setFloatingSlot} className={s.root} />;
};
