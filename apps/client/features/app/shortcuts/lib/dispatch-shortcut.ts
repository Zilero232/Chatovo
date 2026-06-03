import { match } from 'ts-pattern';
import { appEvents } from '@/shared/lib';
import type { ShortcutActionId } from '@/entities/app/shortcut';

type KeyState = 'Pressed' | 'Released';

export const dispatchShortcut = (actionId: ShortcutActionId, state: KeyState) => {
  return match({ actionId, state })
    .with({ actionId: 'pttHold' }, ({ state: s }) => {
      appEvents.emit.pttKey({ phase: s === 'Pressed' ? 'pressed' : 'released' });
    })
    .with({ actionId: 'muteToggle', state: 'Pressed' }, () => {
      appEvents.emit.muteToggle();
    })
    .with({ actionId: 'deafenToggle', state: 'Pressed' }, () => {
      appEvents.emit.deafenToggle();
    })
    .otherwise(() => {});
};
