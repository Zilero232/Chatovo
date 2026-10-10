import { closeLivekitRoom, revokeRoomGrants } from '../../modules/livekit';
import { emitToAll } from '../../modules/realtime';
import { deleteUploadDirectory } from '../../modules/uploads';

/**
 * Everything a deleted room leaves outside its database row: password grants, its entry in
 * every open room list, the live call and its chat attachments on disk.
 */
export const retireRoom = async (roomId: string): Promise<void> => {
  revokeRoomGrants(roomId);
  emitToAll({ type: 'room.removed', roomId });

  await Promise.all([
    closeLivekitRoom(roomId),
    deleteUploadDirectory(`chat-attachments/${roomId}`)
  ]);
};
