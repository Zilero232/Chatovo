'use client';

import { useTranslations } from 'next-intl';
import { useAppSettings } from '@/entities/app/settings';
import { formatPercent } from '@/shared/lib';
import { Slider, Switch } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { SettingRow } from '../components/SettingRow';
import type { SoundCategory } from '@/entities/app/settings';

const SOUND_CATEGORIES: SoundCategory[] = ['join', 'leave', 'mute', 'reconnect', 'message'];

export const SoundsTab = () => {
  const t = useTranslations('settings.sounds');
  const { settings, setGroup, toggleSound } = useAppSettings();

  const sounds = settings.sounds;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        label={t('volumeLabel')}
        hint={t('volumeHint')}
        control={
          <div className={s.sliderRow}>
            <Slider
              aria-label={t('volumeLabel')}
              max={1}
              min={0}
              step={0.05}
              value={[sounds.volume]}
              onValueChange={([value]) => setGroup('sounds', { volume: value })}
            />
            <span className={s.sliderValue}>{formatPercent(sounds.volume)}</span>
          </div>
        }
        stacked
      />

      {SOUND_CATEGORIES.map((category) => (
        <SettingRow
          key={category}
          label={t(category)}
          hint={t(`${category}Hint`)}
          control={
            <Switch
              checked={sounds.enabled[category]}
              onCheckedChange={() => toggleSound(category)}
            />
          }
        />
      ))}
    </div>
  );
};
