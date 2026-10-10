import { closeLivekitRoom, revokeRoomGrants } from '../../../livekit';
import { emitToAll } from '../../../realtime';
import { deleteUploadDirectory } from '../../../uploads';
import { takeOwnedRooms } from '../prepare-user-deletion';

/**
 * Runs after the user row is gone: clears what a cascading delete cannot — the avatar files
 * on disk and the live side of the rooms the user owned (their calls are closed and everyone's
 * room list drops them). Prisma relations handle the rows; messages keep a null sender so
 * other people's conversations stay readable.
 */
export const purgeUserContent = async (userId: string): Promise<void> => {
  await Promise.all(
    takeOwnedRooms(userId).map(async (roomId) => {
      revokeRoomGrants(roomId);
      emitToAll({ type: 'room.removed', roomId });
      await closeLivekitRoom(roomId);
    })
  );

  await deleteUploadDirectory(`avatars/${userId}`);
};
