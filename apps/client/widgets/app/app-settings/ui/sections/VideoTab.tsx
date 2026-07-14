'use client';

import { useTranslations } from 'next-intl';
import { type ScreenQuality, useAppSettings, type VideoQuality } from '@/entities/app/settings';
import { Switch } from '@/shared/ui';
import s from '../AppSettingsButton.module.scss';
import { DeviceSelect } from '../components/DeviceSelect';
import { QualitySelect } from '../components/QualitySelect';
import { SettingRow } from '../components/SettingRow';

const CAMERA_QUALITIES: VideoQuality[] = ['720p', '1080p', '1440p', '4k'];
const SCREEN_QUALITIES: ScreenQuality[] = ['1080p15', '1080p30', '1440p30', '4k30'];

export const VideoTab = () => {
  const t = useTranslations('settings.video');
  const { settings, setGroup } = useAppSettings();

  const video = settings.video;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        label={t('camera')}
        hint={t('cameraHint')}
        control={<DeviceSelect kind="videoinput" />}
        stacked
      />

      <SettingRow
        label={t('cameraQuality')}
        hint={t('cameraQualityHint')}
        control={
          <QualitySelect
            value={video.cameraQuality}
            options={CAMERA_QUALITIES.map((value) => ({
              value,
              label: t(`cameraQualityOptions.${value}`),
            }))}
            onChange={(value) => setGroup('video', { cameraQuality: value })}
          />
        }
        stacked
      />

      <SettingRow
        label={t('screenQuality')}
        hint={t('screenQualityHint')}
        control={
          <QualitySelect
            value={video.screenQuality}
            options={SCREEN_QUALITIES.map((value) => ({
              value,
              label: t(`screenQualityOptions.${value}`),
            }))}
            onChange={(value) => setGroup('video', { screenQuality: value })}
          />
        }
        stacked
      />

      <SettingRow
        label={t('mirror')}
        hint={t('mirrorHint')}
        control={
          <Switch
            checked={video.mirrorVideo}
            onCheckedChange={(value) => setGroup('video', { mirrorVideo: value })}
          />
        }
      />
    </div>
  );
};
