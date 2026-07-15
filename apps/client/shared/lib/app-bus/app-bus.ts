import { createEventEmitter } from '@siberiacancode/reactuse';

import type { RoomKind } from '@chatovo/schemas';

type AppBusEvents = {
  recheckUpdate: undefined;
  updateCheckSettled: undefined;
  trayMuteToggle: undefined;
  muteToggle: undefined;
  deafenToggle: undefined;
  micActivated: undefined;
  pttKey: { phase: 'pressed' | 'released' };
  pttHold: { phase: 'pressed' | 'released' };
  chatToggle: undefined;
  chatMessage: { roomId: string; senderId: string | null; roomKind: RoomKind };
  reaction: undefined;
};

type EventName = keyof AppBusEvents;

type EmitArgs<E extends EventName> = AppBusEvents[E] extends undefined
  ? []
  : [payload: AppBusEvents[E]];

type Emitters = {
  [E in EventName]: (...args: EmitArgs<E>) => void;
};

type Subscribers = {
  [E in EventName]: (listener: (payload: AppBusEvents[E]) => void) => void;
};

const bus = createEventEmitter<AppBusEvents>();

const emit = new Proxy({} as Emitters, {
  get: (_target, event: string) => (payload?: unknown) =>
    bus.push(event as EventName, payload as AppBusEvents[EventName]),
});

const on = new Proxy({} as Subscribers, {
  get: (_target, event: string) => (listener: (payload: AppBusEvents[EventName]) => void) =>
    bus.useSubscribe(event as EventName, listener),
});

/**
 * Typed app-wide event bus — fire-and-forget signals between decoupled parts
 * (tray ↔ voice room, shortcuts ↔ mic). Not state; use Zustand for anything
 * that has a value to read. WS-driven side effects use `useRealtimeMessage`.
 *
 * - `appEvents.emit.<event>(payload?)` — fire (payload omitted for void events).
 * - `appEvents.on.<event>(listener)` — subscribe; this is a React hook, call it
 *   at the top level of a component/hook (auto-unsubscribes on unmount).
 */
export const appEvents = { emit, on };
