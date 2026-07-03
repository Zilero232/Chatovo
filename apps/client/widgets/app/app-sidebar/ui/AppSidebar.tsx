'use client';

import { isTauri } from '@tauri-apps/api/core';
import { isTauriDesktop } from '@/shared/lib';
import { FriendsDialog } from '@/widgets/social/friends-dialog';
import { appSidebarStyles as s } from './AppSidebar.styles';
import {
  CheckUpdateButton,
  DownloadAppButton,
  GithubButton,
  LobbyButton,
  LogoutButton,
  ToggleChannelsButton,
} from './components';
import type { AppSidebarProps } from './AppSidebar.types';

export const AppSidebar = ({
  channelsOpened,
  onToggleChannels,
  orientation = 'vertical',
  showToggleChannels = true,
  onNavigate,
}: AppSidebarProps) => (
  <div className={s.root({ orientation })}>
    {showToggleChannels && (
      <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
    )}
    <LobbyButton onNavigate={onNavigate} />
    <FriendsDialog />
    {!isTauri() && <DownloadAppButton />}
    <div className={s.spacer} />
    <GithubButton />
    {isTauriDesktop() && <CheckUpdateButton />}
    <LogoutButton />
  </div>
);
