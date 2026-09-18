import type { z } from 'zod';

import type {
  banMemberInputSchema,
  createInviteInputSchema,
  createRoleInputSchema,
  createServerInputSchema,
  joinServerInputSchema,
  reorderRolesInputSchema,
  updateMemberInputSchema,
  updateRoleInputSchema,
  updateServerInputSchema
} from './inputs';
import type {
  serverBanSchema,
  serverInvitePreviewSchema,
  serverInviteSchema,
  serverMemberRoleSchema,
  serverMemberSchema,
  serverRoleSchema,
  serverSchema,
  voiceChannelRefSchema
} from './outputs';

export type Server = z.infer<typeof serverSchema>;
export type ServerBan = z.infer<typeof serverBanSchema>;
export type VoiceChannelRef = z.infer<typeof voiceChannelRefSchema>;
export type ServerRole = z.infer<typeof serverRoleSchema>;
export type ServerMember = z.infer<typeof serverMemberSchema>;
export type ServerMemberRole = z.infer<typeof serverMemberRoleSchema>;
export type ServerInvite = z.infer<typeof serverInviteSchema>;
export type ServerInvitePreview = z.infer<typeof serverInvitePreviewSchema>;

export type BanMemberRequest = z.infer<typeof banMemberInputSchema>;
export type CreateServerRequest = z.infer<typeof createServerInputSchema>;
export type UpdateServerRequest = z.infer<typeof updateServerInputSchema>;
export type CreateRoleRequest = z.infer<typeof createRoleInputSchema>;
export type UpdateRoleRequest = z.infer<typeof updateRoleInputSchema>;
export type ReorderRolesRequest = z.infer<typeof reorderRolesInputSchema>;
export type UpdateMemberRequest = z.infer<typeof updateMemberInputSchema>;
export type CreateInviteRequest = z.infer<typeof createInviteInputSchema>;
export type JoinServerRequest = z.infer<typeof joinServerInputSchema>;
