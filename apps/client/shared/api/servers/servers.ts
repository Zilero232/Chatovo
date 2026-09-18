import type {
  BanMemberRequest,
  CreateInviteRequest,
  CreateRoleRequest,
  CreateServerRequest,
  ReorderRolesRequest,
  Server,
  ServerBan,
  ServerInvite,
  ServerInvitePreview,
  ServerMember,
  ServerRole,
  UpdateMemberRequest,
  UpdateRoleRequest,
  UpdateServerRequest
} from '@chatovo/schemas';

import { api } from '../http';

export const listServers = async (): Promise<Server[]> => {
  const { data } = await api.get('/servers');

  return data;
};

export const getServer = async (serverId: string): Promise<Server> => {
  const { data } = await api.get(`/servers/${serverId}`);

  return data;
};

export const createServer = async (input: CreateServerRequest): Promise<Server> => {
  const { data } = await api.post('/servers', input);

  return data;
};

export const updateServer = async (
  serverId: string,
  input: UpdateServerRequest
): Promise<Server> => {
  const { data } = await api.patch(`/servers/${serverId}`, input);

  return data;
};

export const deleteServer = async (serverId: string): Promise<void> => {
  await api.delete(`/servers/${serverId}`);
};

export const leaveServer = async (serverId: string): Promise<void> => {
  await api.post(`/servers/${serverId}/leave`);
};

export const transferServerOwnership = async (
  serverId: string,
  userId: string
): Promise<Server> => {
  const { data } = await api.post(`/servers/${serverId}/transfer/${userId}`);

  return data;
};

export const updateServerIcon = async (serverId: string, icon: File | null): Promise<Server> => {
  if (!icon) {
    const { data } = await api.delete(`/servers/${serverId}/icon`);

    return data;
  }

  const form = new FormData();

  form.append('icon', icon);

  const { data } = await api.post(`/servers/${serverId}/icon`, form);

  return data;
};

export const listServerBans = async (serverId: string): Promise<ServerBan[]> => {
  const { data } = await api.get(`/servers/${serverId}/bans`);

  return data;
};

export const banServerMember = async (
  serverId: string,
  userId: string,
  input: BanMemberRequest
): Promise<ServerBan> => {
  const { data } = await api.post(`/servers/${serverId}/bans/${userId}`, input);

  return data;
};

export const unbanServerMember = async (serverId: string, userId: string): Promise<void> => {
  await api.delete(`/servers/${serverId}/bans/${userId}`);
};

export const listServerMembers = async (serverId: string): Promise<ServerMember[]> => {
  const { data } = await api.get(`/servers/${serverId}/members`);

  return data;
};

export const updateServerMember = async (
  serverId: string,
  userId: string,
  input: UpdateMemberRequest
): Promise<ServerMember> => {
  const { data } = await api.patch(`/servers/${serverId}/members/${userId}`, input);

  return data;
};

export const kickServerMember = async (serverId: string, userId: string): Promise<void> => {
  await api.delete(`/servers/${serverId}/members/${userId}`);
};

export const listServerRoles = async (serverId: string): Promise<ServerRole[]> => {
  const { data } = await api.get(`/servers/${serverId}/roles`);

  return data;
};

export const createServerRole = async (
  serverId: string,
  input: CreateRoleRequest
): Promise<ServerRole> => {
  const { data } = await api.post(`/servers/${serverId}/roles`, input);

  return data;
};

export const updateServerRole = async (
  serverId: string,
  roleId: string,
  input: UpdateRoleRequest
): Promise<ServerRole> => {
  const { data } = await api.patch(`/servers/${serverId}/roles/${roleId}`, input);

  return data;
};

export const reorderServerRoles = async (
  serverId: string,
  input: ReorderRolesRequest
): Promise<ServerRole[]> => {
  const { data } = await api.patch(`/servers/${serverId}/roles/reorder`, input);

  return data;
};

export const deleteServerRole = async (serverId: string, roleId: string): Promise<void> => {
  await api.delete(`/servers/${serverId}/roles/${roleId}`);
};

export const listServerInvites = async (serverId: string): Promise<ServerInvite[]> => {
  const { data } = await api.get(`/servers/${serverId}/invites`);

  return data;
};

export const createServerInvite = async (
  serverId: string,
  input: CreateInviteRequest
): Promise<ServerInvite> => {
  const { data } = await api.post(`/servers/${serverId}/invites`, input);

  return data;
};

export const revokeServerInvite = async (serverId: string, inviteId: string): Promise<void> => {
  await api.delete(`/servers/${serverId}/invites/${inviteId}`);
};

export const previewServerInvite = async (code: string): Promise<ServerInvitePreview> => {
  const { data } = await api.get(`/servers/invites/${code}`);

  return data;
};

export const joinServerByInvite = async (code: string): Promise<Server> => {
  const { data } = await api.post('/servers/join', { code });

  return data;
};
