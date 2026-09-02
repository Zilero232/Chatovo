'use client';

import { useTranslations } from 'next-intl';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { Switch } from '@/ui-kit';

import { SettingRow } from '../components/SettingRow/SettingRow';

import s from '../AppSettingsButton.module.scss';

export const SystemTab = () => {
  const t = useTranslations('settings.system');
  const { settings, setGroup } = useAppSettings();
  const { isAdmin } = useCurrentUser();

  const { tray, invisibleMode } = settings.system;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        control={
          <Switch
            checked={tray.closeToTray}
            onCheckedChange={(value) =>
              setGroup('system', { tray: { ...tray, closeToTray: value } })
            }
          />
        }
        hint={t('closeToTrayHint')}
        label={t('closeToTray')}
      />

      {isAdmin && (
        <SettingRow
          control={
            <Switch
              checked={invisibleMode}
              onCheckedChange={(value) => setGroup('system', { invisibleMode: value })}
            />
          }
          hint={t('invisibleModeHint')}
          label={t('invisibleMode')}
        />
      )}
    </div>
  );
};
