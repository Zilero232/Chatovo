import { WS_CLOSE_CODE } from '@chatovo/schemas';

import { closeUserConnections } from '../../../realtime';
import { deleteUploadDirectory } from '../../../uploads';

/**
 * Clears what a cascading delete cannot: the avatar files on disk and any live
 * connection. Prisma relations handle the rows; messages keep a null sender so
 * other people's conversations stay readable.
 */
export const purgeUserContent = async (userId: string): Promise<void> => {
  closeUserConnections(userId, WS_CLOSE_CODE.blocked, 'Account deleted');

  await deleteUploadDirectory(`avatars/${userId}`);
};
