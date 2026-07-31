'use client';

import type { RoomControllersProps } from './RoomControllers.types';

import { DeafenSyncController } from '../DeafenSyncController/DeafenSyncController';
import { LocalSpeakingController } from '../LocalSpeakingController/LocalSpeakingController';
import { MicActivationController } from '../MicActivationController/MicActivationController';
import { MicStateController } from '../MicStateController/MicStateController';
import { RoomDeviceController } from '../RoomDeviceController/RoomDeviceController';
import { RoomRealtimeSubscribe } from '../RoomRealtimeSubscribe/RoomRealtimeSubscribe';
import { RoomSoundsController } from '../RoomSoundsController/RoomSoundsController';
import { RoomTrayController } from '../RoomTrayController/RoomTrayController';
import { ShortcutActionsController } from '../ShortcutActionsController/ShortcutActionsController';

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
