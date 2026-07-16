'use client';

import { useConnectionState } from '@livekit/components-react';
import { clsx } from 'clsx';
import { ConnectionState } from 'livekit-client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Spinner, Text } from '@/shared/ui';

import s from './ConnectingOverlay.module.scss';

import type { ConnectingOverlayProps } from './ConnectingOverlay.types';

export const ConnectingOverlay = ({ roomName }: ConnectingOverlayProps) => {
  const t = useTranslations('room');
  const state = useConnectionState();
  const shouldReduceMotion = useReducedMotion();

  const text = match(state)
    .with(ConnectionState.Connected, ConnectionState.Disconnected, () => null)
    .with(ConnectionState.Reconnecting, ConnectionState.SignalReconnecting, () =>
      t('reconnecting', { name: roomName }),
    )
    .with(ConnectionState.Connecting, () => t('connecting', { name: roomName }))
    .exhaustive();

  return (
    <AnimatePresence>
      {text !== null && (
        <motion.div
          className={s.root}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={clsx(s.box, 'glass shadow-glow-violet')}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <Spinner size="lg" />
            <Text className={s.text} size="sm" tone="inherit">
              {text}
            </Text>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
