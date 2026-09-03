'use client';

import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';

import { isTauriDesktop } from '@/shared/lib';
import { FriendsDialog } from '@/widgets/social/friends-dialog';

import type { AppSidebarProps } from './AppSidebar.types';

import {
  AdminButton,
  CheckUpdateButton,
  DownloadAppButton,
  GithubButton,
  GnomeVpnButton,
  LogoutButton,
  ToggleChannelsButton
} from './components';

import s from './AppSidebar.module.scss';

export const AppSidebar = ({
  channelsOpened,
  onToggleChannels,
  orientation = 'vertical',
  showToggleChannels = true
}: AppSidebarProps) => (
  <div
    className={clsx(s.root, {
      [s.vertical]: orientation === 'vertical',
      [s.horizontal]: orientation !== 'vertical'
    })}
  >
    {showToggleChannels && (
      <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
    )}
    <AdminButton />
    <GnomeVpnButton />
    <FriendsDialog />
    {!isTauri() && <DownloadAppButton />}
    <div className={s.spacer} />
    <GithubButton />
    {isTauriDesktop() && <CheckUpdateButton />}
    <LogoutButton />
  </div>
);
