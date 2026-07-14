'use client';

import { clsx } from 'clsx';
import { ScrollArea } from '@/shared/ui';
import { LobbyHeader, LobbyRooms } from './components';
import s from './LobbyPage.module.scss';

export const LobbyPage = () => (
  <ScrollArea className={s.root}>
    <div aria-hidden className="lobby-ambience">
      <span className="lobby-ambience-orb lobby-ambience-orb-violet" />
      <span className="lobby-ambience-orb lobby-ambience-orb-cyan" />
    </div>

    <div className={clsx(s.container, 'pb-page')}>
      <LobbyHeader />
      <LobbyRooms />
    </div>
  </ScrollArea>
);
