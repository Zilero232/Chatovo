'use client';

import { DeafenSyncController } from '../DeafenSyncController/DeafenSyncController';
import { LocalSpeakingController } from '../LocalSpeakingController/LocalSpeakingController';
import { MicActivationController } from '../MicActivationController/MicActivationController';
import { MicStateController } from '../MicStateController/MicStateController';
import { RoomDeviceController } from '../RoomDeviceController/RoomDeviceController';
import { RoomRealtimeSubscribe } from '../RoomRealtimeSubscribe/RoomRealtimeSubscribe';
import { RoomSoundsController } from '../RoomSoundsController/RoomSoundsController';
import { RoomTrayController } from '../RoomTrayController/RoomTrayController';
import { SessionStatsController } from '../SessionStatsController/SessionStatsController';
import { ShortcutActionsController } from '../ShortcutActionsController/ShortcutActionsController';

export const RoomControllers = () => (
  <>
    <RoomRealtimeSubscribe />
    <RoomDeviceController />
    <RoomTrayController />
    <ShortcutActionsController />
    <MicActivationController />
    <LocalSpeakingController />
    <SessionStatsController />
    <MicStateController />
    <RoomSoundsController />
    <DeafenSyncController />
  </>
);
