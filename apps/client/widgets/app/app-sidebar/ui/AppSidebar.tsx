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
  LogoutButton,
  ToggleChannelsButton
} from './components';

import s from './AppSidebar.module.scss';

export const AppSidebar = ({
  channelsOpened,
  onToggleChannels,
  orientation = 'vertical',
  showToggleChannels = true
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
      <GnomeVpnButton />
      <FriendsDialog />
      {!isTauri() && <DownloadAppButton />}
      <div className={s.spacer} />
      <AdminMenuButton side={isVertical ? 'right' : 'top'} />
      {isDesktop && <CheckUpdateButton />}
      <LogoutButton />
    </div>
  );
};
