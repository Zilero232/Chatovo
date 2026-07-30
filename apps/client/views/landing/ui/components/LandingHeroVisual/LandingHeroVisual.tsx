'use client';

import { clsx } from 'clsx';
import { motion, useReducedMotion } from 'motion/react';

import { Text } from '@/shared/ui';

import type { LandingHeroVisualProps } from './LandingHeroVisual.types';

import { LANDING_HERO_SPEAKERS, LANDING_WAVE_BARS } from '../../../config';
import {
  HERO_SPEAKER_PULSE,
  HERO_SPEAKER_TRANSITION,
  HERO_VISUAL_ANIMATE,
  HERO_VISUAL_INITIAL,
  HERO_VISUAL_REDUCED_INITIAL,
  HERO_VISUAL_TRANSITION
} from './LandingHeroVisual.motion';

import s from '../../LandingPage.module.scss';

export const LandingHeroVisual = ({ liveLabel }: LandingHeroVisualProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      animate={HERO_VISUAL_ANIMATE}
      className={clsx(s.heroVisual, 'glass')}
      initial={shouldReduceMotion ? HERO_VISUAL_REDUCED_INITIAL : HERO_VISUAL_INITIAL}
      transition={HERO_VISUAL_TRANSITION}
    >
      <div className={s.heroSpeakers}>
        {LANDING_HERO_SPEAKERS.map((speaker, index) => (
          <motion.span
            key={speaker.id}
            animate={shouldReduceMotion || !speaker.active ? undefined : HERO_SPEAKER_PULSE}
            className={clsx(s.heroSpeaker, speaker.active && s.heroSpeakerActive)}
            transition={{ ...HERO_SPEAKER_TRANSITION, delay: index * 0.35 }}
          >
            {speaker.initial}
          </motion.span>
        ))}
      </div>

      <div className={s.wave}>
        {LANDING_WAVE_BARS.map((bar) => (
          <span
            key={bar.id}
            className={s.waveBar}
            style={{ height: bar.height, animationDelay: bar.delay }}
          />
        ))}
      </div>

      <div className={s.heroVisualCaption}>
        <span aria-hidden className={s.heroVisualDot} />
        <Text as='span' size='sm' tone='inherit'>
          {liveLabel}
        </Text>
      </div>
    </motion.div>
  );
};
