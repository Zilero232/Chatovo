'use client';

import { DeafenSyncController } from '../DeafenSyncController';
import { LocalSpeakingController } from '../LocalSpeakingController';
import { MicActivationController } from '../MicActivationController';
import { MicStateController } from '../MicStateController';
import { RoomDeviceController } from '../RoomDeviceController';
import { RoomRealtimeSubscribe } from '../RoomRealtimeSubscribe';
import { RoomSoundsController } from '../RoomSoundsController';
import { RoomTrayController } from '../RoomTrayController';
import { ShortcutActionsController } from '../ShortcutActionsController';

import type { RoomControllersProps } from './RoomControllers.types';

export const RoomControllers = ({ roomId }: RoomControllersProps) => (
  <>
    <RoomRealtimeSubscribe roomId={roomId} />
    <RoomDeviceController />
    <RoomTrayController />
    <ShortcutActionsController />
    <MicActivationController />
    <LocalSpeakingController />
    <MicStateController roomId={roomId} />
    <RoomSoundsController roomId={roomId} />
    <DeafenSyncController />
  </>
);
