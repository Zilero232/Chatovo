'use client';

import { useState } from 'react';
import { match } from 'ts-pattern';

import type { LobbyTab } from './LobbyPage.types';

import {
  ActiveNowPanel,
  LobbyAddFriend,
  LobbyHeaderBar,
  LobbyServers,
  LobbyTabPanel
} from './components';

import s from './LobbyPage.module.scss';

export const LobbyPage = () => {
  const [tab, setTab] = useState<LobbyTab>('online');

  return (
    <div className={s.root}>
      <LobbyHeaderBar tab={tab} onTabChange={setTab} />

      <div className={s.body}>
        <div className={s.main}>
          {match(tab)
            .with('servers', () => <LobbyServers />)
            .with('add', () => <LobbyAddFriend />)
            .with('online', 'all', (value) => <LobbyTabPanel tab={value} />)
            .exhaustive()}
        </div>

        <ActiveNowPanel />
      </div>
    </div>
  );
};
