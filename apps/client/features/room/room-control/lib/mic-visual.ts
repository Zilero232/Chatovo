import { match } from 'ts-pattern';

export type PttState = 'disabled' | 'idle' | 'active';

export type ControlTone = 'on' | 'off' | 'active' | 'danger';

export type MicVisual = {
  tone: ControlTone;
  labelKey: 'mute' | 'unmute' | 'pttHint';
  isMuted: boolean;
};

export const resolveMicVisual = (pttState: PttState, isMicrophoneEnabled: boolean): MicVisual => {
  return match({ pttState, isMicrophoneEnabled })
    .with(
      { isMicrophoneEnabled: false },
      () => ({ tone: 'danger', labelKey: 'unmute', isMuted: true }) as const,
    )
    .with(
      { pttState: 'active' },
      () => ({ tone: 'active', labelKey: 'pttHint', isMuted: false }) as const,
    )
    .with(
      { pttState: 'idle' },
      () => ({ tone: 'off', labelKey: 'pttHint', isMuted: false }) as const,
    )
    .otherwise(() => ({ tone: 'on', labelKey: 'mute', isMuted: false }) as const);
};
