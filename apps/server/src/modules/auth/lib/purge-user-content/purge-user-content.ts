import { retireRoom } from '../../../../lib';
import { deleteUploadDirectory } from '../../../uploads';
import { takeOwnedRooms } from '../../owned-rooms-store';

/**
 * Runs after the user row is gone: clears what a cascading delete cannot — the avatar files
 * on disk and the live side of the rooms the user owned (their calls are closed and everyone's
 * room list drops them). Prisma relations handle the rows; messages keep a null sender so
 * other people's conversations stay readable.
 */
export const purgeUserContent = async (userId: string): Promise<void> => {
  await Promise.all(takeOwnedRooms(userId).map(retireRoom));

  await deleteUploadDirectory(`avatars/${userId}`);
};
