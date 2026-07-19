'use client';

import { clsx } from 'clsx';
import { motion, useReducedMotion } from 'motion/react';

import { Text } from '@/shared/ui';
import { LANDING_HERO_SPEAKERS, LANDING_WAVE_BARS } from '../../../config';

import s from '../../LandingPage.module.scss';

import type { LandingHeroVisualProps } from './LandingHeroVisual.types';

export const LandingHeroVisual = ({ liveLabel }: LandingHeroVisualProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={clsx(s.heroVisual, 'glass')}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28, delay: 0.15 }}
    >
      <div className={s.heroSpeakers}>
        {LANDING_HERO_SPEAKERS.map((speaker, index) => (
          <motion.span
            key={speaker.id}
            className={clsx(s.heroSpeaker, speaker.active && s.heroSpeakerActive)}
            animate={shouldReduceMotion || !speaker.active ? undefined : { scale: [1, 1.07, 1] }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: index * 0.35,
            }}
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
        <Text as="span" size="sm" tone="inherit">
          {liveLabel}
        </Text>
      </div>
    </motion.div>
  );
};
