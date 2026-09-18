'use client';

import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';
import { Download, Eye, EyeOff, RefreshCw, ShieldCheck, Users, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { DownloadAppDialog } from '@/features/app/download-app';
import { EXTERNAL_LINKS, ROUTES } from '@/shared/constants';
import { useIsTauriDesktop } from '@/shared/hooks';

import type { ChannelsShortcutsProps } from './ChannelsShortcuts.types';

import { useAppUpdateShortcut } from '../../../model/hooks';
import { ShortcutRow } from './components';

import s from './ChannelsShortcuts.module.scss';

export const ChannelsShortcuts = ({ onNavigate }: ChannelsShortcutsProps = {}) => {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('appSidebar');
  const tLobby = useTranslations('lobby.tabs');
  const tAdmin = useTranslations('admin');
  const tSystem = useTranslations('settings.system');

  const { isAdmin } = useCurrentUser();
  const { settings, setGroup } = useAppSettings();
  const isDesktop = useIsTauriDesktop();

  const isInvisible = settings.system.invisibleMode;
  const { isChecking, isDownloadOpen, checkUpdate, toggleDownload } = useAppUpdateShortcut();

  return (
    <nav className={s.root}>
      <ShortcutRow
        icon={<Users />}
        isActive={pathname === ROUTES.lobby}
        label={tLobby('friends')}
        onSelect={() => {
          router.push(ROUTES.lobby);
          onNavigate?.();
        }}
      />

      <ShortcutRow
        isHighlighted
        href={EXTERNAL_LINKS.gnomeVpn}
        icon={<ShieldCheck />}
        label={t('gnomeVpn')}
      />

      {!isTauri() && (
        <ShortcutRow
          icon={<Download />}
          label={t('downloadApp')}
          onSelect={() => toggleDownload(true)}
        />
      )}

      {isDesktop && (
        <ShortcutRow
          icon={<RefreshCw className={clsx({ [s.spinning]: isChecking })} />}
          isDisabled={isChecking}
          label={t('checkUpdate')}
          onSelect={checkUpdate}
        />
      )}

      {isAdmin && (
        <>
          <ShortcutRow
            icon={<Wrench />}
            isActive={pathname.startsWith(ROUTES.admin)}
            label={tAdmin('title')}
            onSelect={() => {
              router.push(ROUTES.admin);
              onNavigate?.();
            }}
          />

          <ShortcutRow
            icon={isInvisible ? <EyeOff /> : <Eye />}
            isActive={isInvisible}
            label={tSystem('invisibleMode')}
            onSelect={() => setGroup('system', { invisibleMode: !isInvisible })}
          />
        </>
      )}

      <DownloadAppDialog open={isDownloadOpen} onOpenChange={toggleDownload} />
    </nav>
  );
};
