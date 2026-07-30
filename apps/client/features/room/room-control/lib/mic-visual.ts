import { match } from 'ts-pattern';

export type PttState = 'active' | 'disabled' | 'idle';

export type ControlTone = 'active' | 'danger' | 'off' | 'on';

export type MicVisual = {
  isMuted: boolean;
  labelKey: 'mute' | 'pttHint' | 'unmute';
  tone: ControlTone;
};

export const resolveMicVisual = (pttState: PttState, isMicrophoneEnabled: boolean): MicVisual =>
  match({ pttState, isMicrophoneEnabled })
    .with(
      { isMicrophoneEnabled: false },
      () => ({ tone: 'danger', labelKey: 'unmute', isMuted: true }) as const
    )
    .with(
      { pttState: 'active' },
      () => ({ tone: 'active', labelKey: 'pttHint', isMuted: false }) as const
    )
    .with(
      { pttState: 'idle' },
      () => ({ tone: 'off', labelKey: 'pttHint', isMuted: false }) as const
    )
    .otherwise(() => ({ tone: 'on', labelKey: 'mute', isMuted: false }) as const);
