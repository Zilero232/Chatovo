import { LeaveRoom } from '@/features/leave-room';
import { MuteToggle } from '@/features/mute-toggle';
import { ShareScreen } from '@/features/share-screen';
import { CameraToggle } from '@/features/toggle-camera';

export const ControlBar = () => (
  <div className="flex items-center justify-center gap-3 border-t bg-card px-6 py-3">
    <MuteToggle />
    <CameraToggle />
    <ShareScreen />
    <div className="mx-2 h-6 w-px bg-border" />
    <LeaveRoom />
  </div>
);
