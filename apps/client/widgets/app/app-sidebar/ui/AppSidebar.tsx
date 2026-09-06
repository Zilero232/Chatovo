'use client';

import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';

import { useIsTauriDesktop } from '@/shared/hooks';
import { FriendsDialog } from '@/widgets/social/friends-dialog';

import type { AppSidebarProps } from './AppSidebar.types';

import {
  AdminMenuButton,
  CheckUpdateButton,
  DownloadAppButton,
  GnomeVpnButton,
  LobbyButton,
  LogoutButton,
  ToggleChannelsButton
} from './components';

import s from './AppSidebar.module.scss';

export const AppSidebar = ({
  channelsOpened,
  orientation = 'vertical',
  showToggleChannels = true,
  onNavigate,
  onToggleChannels
}: AppSidebarProps) => {
  const isDesktop = useIsTauriDesktop();
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={clsx(s.root, {
        [s.vertical]: isVertical,
        [s.horizontal]: !isVertical
      })}
    >
      {showToggleChannels && (
        <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
      )}
      <LobbyButton side={isVertical ? 'right' : 'top'} onNavigate={onNavigate} />
      <GnomeVpnButton />
      <FriendsDialog />
      {!isTauri() && <DownloadAppButton />}
      <div className={s.spacer} />
      <AdminMenuButton side={isVertical ? 'right' : 'top'} onNavigate={onNavigate} />
      {isDesktop && <CheckUpdateButton />}
      <LogoutButton />
    </div>
  );
};
