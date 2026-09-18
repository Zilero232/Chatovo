import {
  banMemberInputSchema,
  createInviteInputSchema,
  createRoleInputSchema,
  createServerInputSchema,
  joinServerInputSchema,
  reorderRolesInputSchema,
  serverBanSchema,
  serverInvitePreviewSchema,
  serverInviteSchema,
  serverMemberSchema,
  serverRoleSchema,
  serverSchema,
  updateMemberInputSchema,
  updateRoleInputSchema,
  updateServerInputSchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class ServerDto extends createZodDto(serverSchema) {}

export class ServerRoleDto extends createZodDto(serverRoleSchema) {}

export class ServerMemberDto extends createZodDto(serverMemberSchema) {}

export class ServerInviteDto extends createZodDto(serverInviteSchema) {}

export class ServerBanDto extends createZodDto(serverBanSchema) {}

export class BanMemberDto extends createZodDto(banMemberInputSchema) {}

export class ServerInvitePreviewDto extends createZodDto(serverInvitePreviewSchema) {}

export class CreateServerDto extends createZodDto(createServerInputSchema) {}

export class UpdateServerDto extends createZodDto(updateServerInputSchema) {}

export class CreateRoleDto extends createZodDto(createRoleInputSchema) {}

export class UpdateRoleDto extends createZodDto(updateRoleInputSchema) {}

export class ReorderRolesDto extends createZodDto(reorderRolesInputSchema) {}

export class UpdateMemberDto extends createZodDto(updateMemberInputSchema) {}

export class CreateInviteDto extends createZodDto(createInviteInputSchema) {}

export class JoinServerDto extends createZodDto(joinServerInputSchema) {}
