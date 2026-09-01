'use client';

import { clsx } from 'clsx';

import { MobileUpdateBanner } from '@/features/app/check-app-update';
import { ScrollArea } from '@/ui-kit';

import { LobbyContributors, LobbyHeader, LobbyRooms } from './components';

import s from './LobbyPage.module.scss';

export const LobbyPage = () => (
  <ScrollArea className={s.root}>
    <div aria-hidden className='lobby-ambience'>
      <span className='lobby-ambience-orb lobby-ambience-orb-violet' />
      <span className='lobby-ambience-orb lobby-ambience-orb-cyan' />
    </div>

    <div className={clsx(s.container, 'pb-page')}>
      <MobileUpdateBanner />
      <LobbyHeader />
      <LobbyContributors />
      <LobbyRooms />
    </div>
  </ScrollArea>
);
