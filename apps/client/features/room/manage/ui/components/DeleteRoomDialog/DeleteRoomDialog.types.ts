import type { Room } from '@chatovo/schemas';

export type DeleteRoomDialogProps = {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
