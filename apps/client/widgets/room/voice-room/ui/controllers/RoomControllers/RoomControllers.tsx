'use client';

import { DeafenSyncController } from '../DeafenSyncController/DeafenSyncController';
import { InvisibleNoticeController } from '../InvisibleNoticeController';
import { LocalSpeakingController } from '../LocalSpeakingController/LocalSpeakingController';
import { MicActivationController } from '../MicActivationController/MicActivationController';
import { MicStateController } from '../MicStateController/MicStateController';
import { RoomDeviceController } from '../RoomDeviceController/RoomDeviceController';
import { RoomEasterEggsController } from '../RoomEasterEggsController/RoomEasterEggsController';
import { RoomRealtimeSubscribe } from '../RoomRealtimeSubscribe/RoomRealtimeSubscribe';
import { RoomSoundsController } from '../RoomSoundsController/RoomSoundsController';
import { RoomTrayController } from '../RoomTrayController/RoomTrayController';
import { ShortcutActionsController } from '../ShortcutActionsController/ShortcutActionsController';

export const RoomControllers = () => (
  <>
    <RoomRealtimeSubscribe />
    <RoomDeviceController />
    <RoomTrayController />
    <ShortcutActionsController />
    <MicActivationController />
    <LocalSpeakingController />
    <MicStateController />
    <RoomSoundsController />
    <DeafenSyncController />
    <RoomEasterEggsController />
    <InvisibleNoticeController />
  </>
);
