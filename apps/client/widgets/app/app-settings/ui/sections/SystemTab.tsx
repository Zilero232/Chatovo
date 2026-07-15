'use client';

import { useTranslations } from 'next-intl';

import { useAppSettings } from '@/entities/app/settings';
import { Switch } from '@/shared/ui';
import { SettingRow } from '../components/SettingRow';

import s from '../AppSettingsButton.module.scss';

export const SystemTab = () => {
  const t = useTranslations('settings.system');
  const { settings, setGroup } = useAppSettings();

  const { tray } = settings.system;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        label={t('closeToTray')}
        hint={t('closeToTrayHint')}
        control={
          <Switch
            checked={tray.closeToTray}
            onCheckedChange={(value) =>
              setGroup('system', { tray: { ...tray, closeToTray: value } })
            }
          />
        }
      />
    </div>
  );
};
