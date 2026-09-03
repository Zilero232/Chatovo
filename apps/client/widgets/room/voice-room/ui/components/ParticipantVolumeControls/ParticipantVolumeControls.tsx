'use client';

import { Volume1, Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatPercent } from '@/shared/lib';
import { ContextMenuItem, ContextMenuSeparator, Slider } from '@/ui-kit';

import type { ParticipantVolumeControlsProps } from './ParticipantVolumeControls.types';

import { useParticipantVolume } from '../../../model/hooks';

import s from './ParticipantVolumeControls.module.scss';

export const ParticipantVolumeControls = ({
  participant,
  displayName
}: ParticipantVolumeControlsProps) => {
  const t = useTranslations('participant');

  const { isMuted, volume, isControllable, setVolume, toggleMute } =
    useParticipantVolume(participant);

  if (!isControllable) {
    return null;
  }

  return (
    <>
      <ContextMenuSeparator />

      <ContextMenuItem onSelect={toggleMute}>
        {isMuted ? <Volume2 /> : <VolumeX />}
        {isMuted ? t('unmuteForMe') : t('muteForMe')}
      </ContextMenuItem>

      <ContextMenuItem className={s.volumeItem} closeOnClick={false}>
        <div className={s.volumeRow}>
          <span className={s.volumeLabel}>
            <Volume1 />
            {t('volume')}
          </span>
          <span className={s.volumeValue}>{formatPercent(volume)}</span>
        </div>

        <Slider
          aria-label={t('volumeFor', { name: displayName })}
          max={1}
          min={0}
          step={0.01}
          value={volume}
          onValueChange={(next) => setVolume(next as number)}
        />
      </ContextMenuItem>
    </>
  );
};
