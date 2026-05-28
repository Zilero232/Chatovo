import type { Room } from '@chatovo/schemas';

export type EditRoomDialogProps = {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type EditRoomFormProps = {
  room: Room;
  // Fired once the room is updated — lets the dialog close itself.
  onUpdated?: () => void;
};
