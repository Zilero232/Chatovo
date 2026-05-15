'use client';

import type { ServerRailProps } from './ServerRail.types';

import { LobbyButton, LogoutButton, ToggleChannelsButton } from './components';
import { serverRailStyles as s } from './ServerRail.styles';

export const ServerRail = ({ channelsOpened, onToggleChannels }: ServerRailProps) => (
  <div className={s.root}>
    <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
    <LobbyButton />
    <div className={s.spacer} />
    <LogoutButton />
  </div>
);
