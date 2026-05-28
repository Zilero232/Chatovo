'use client';

import { MicActivationController } from '../MicActivationController';
import { MicStateController } from '../MicStateController';
import { RoomDeviceController } from '../RoomDeviceController';
import { RoomSoundsController } from '../RoomSoundsController';
import { RoomTrayController } from '../RoomTrayController';
import { ShortcutActionsController } from '../ShortcutActionsController';

type RoomControllersProps = {
  roomId: string;
  isChatOpen: boolean;
};

// Aggregates every side-effect controller the voice room needs. Mounted once
// inside LiveKitRoom so each controller can pull from the participant/room
// context.
export const RoomControllers = ({ roomId, isChatOpen }: RoomControllersProps) => (
  <>
    <RoomDeviceController />
    <RoomTrayController />
    <ShortcutActionsController />
    <MicActivationController />
    <MicStateController roomId={roomId} />
    <RoomSoundsController isChatOpen={isChatOpen} />
  </>
);
