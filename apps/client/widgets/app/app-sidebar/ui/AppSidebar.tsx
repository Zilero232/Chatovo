'use client';

import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';
import { isTauriDesktop } from '@/shared/lib';
import { FriendsDialog } from '@/widgets/social/friends-dialog';
import s from './AppSidebar.module.scss';
import {
  CheckUpdateButton,
  DownloadAppButton,
  GithubButton,
  LogoutButton,
  ToggleChannelsButton,
} from './components';
import type { AppSidebarProps } from './AppSidebar.types';

export const AppSidebar = ({
  channelsOpened,
  onToggleChannels,
  orientation = 'vertical',
  showToggleChannels = true,
}: AppSidebarProps) => (
  <div className={clsx(s.root, orientation === 'vertical' ? s.vertical : s.horizontal)}>
    {showToggleChannels && (
      <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
    )}
    <FriendsDialog />
    {!isTauri() && <DownloadAppButton />}
    <div className={s.spacer} />
    <GithubButton />
    {isTauriDesktop() && <CheckUpdateButton />}
    <LogoutButton />
  </div>
);
