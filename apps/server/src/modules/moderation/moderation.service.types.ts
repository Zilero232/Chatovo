import type {
  AbuseTarget,
  AdminReportQuery,
  AdminRoomQuery,
  AdminUserMessageQuery,
  AdminUserQuery,
  BlockUserValues,
  ReportAbuseValues,
  UpdateAdminUserValues
} from '@chatovo/schemas';

import type { Prisma } from '../../../generated';

export type ReportAbuseInput = {
  input: ReportAbuseValues;
  reporterId: string;
};

export type BlockUserInput = {
  adminId: string;
  input: BlockUserValues;
  userId: string;
};

export type UnblockUserInput = {
  adminId: string;
  userId: string;
};

export type ResolveReportInput = {
  adminId: string;
  reportId: string;
};

export type ReportAbuseTarget = {
  target: AbuseTarget;
  targetId: string;
  reporterId: string;
};

export type ListOnlineUsersInput = {
  where: Prisma.UserWhereInput;
  page: number;
  perPage: number;
};

export type ListAdminUsersInput = {
  adminId: string;
  query: AdminUserQuery;
};

export type GetAdminUserInput = {
  adminId: string;
  userId: string;
};

export type ListUserMessagesInput = {
  adminId: string;
  userId: string;
  query: AdminUserMessageQuery;
};

export type UpdateAdminUserInput = {
  adminId: string;
  userId: string;
  input: UpdateAdminUserValues;
};

export type ListAdminRoomsInput = {
  adminId: string;
  query: AdminRoomQuery;
};

export type DeleteAdminRoomInput = {
  adminId: string;
  roomId: string;
};

export type ListAbuseReportsInput = {
  adminId: string;
  query: AdminReportQuery;
};
