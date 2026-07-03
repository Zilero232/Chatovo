import { z } from 'zod';

export const sendFriendRequestInputSchema = z.object({
  tag: z.string().min(3),
});
