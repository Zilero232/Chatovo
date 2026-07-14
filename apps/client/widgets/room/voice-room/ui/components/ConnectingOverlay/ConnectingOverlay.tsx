'use client';

import { useConnectionState } from '@livekit/components-react';
import { clsx } from 'clsx';
import { ConnectionState } from 'livekit-client';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Spinner } from '@/shared/ui';

import s from './ConnectingOverlay.module.scss';

import type { ConnectingOverlayProps } from './ConnectingOverlay.types';

export const ConnectingOverlay = ({ roomName }: ConnectingOverlayProps) => {
  const t = useTranslations('room');
  const state = useConnectionState();

  const text = match(state)
    .with(ConnectionState.Connected, ConnectionState.Disconnected, () => null)
    .with(ConnectionState.Reconnecting, ConnectionState.SignalReconnecting, () =>
      t('reconnecting', { name: roomName }),
    )
    .with(ConnectionState.Connecting, () => t('connecting', { name: roomName }))
    .exhaustive();

  if (text === null) {
    return null;
  }

  return (
    <div className={s.root}>
      <div className={clsx(s.box, 'glass shadow-glow-violet')}>
        <Spinner size="lg" />
        <p className={s.text}>{text}</p>
      </div>
    </div>
  );
};
