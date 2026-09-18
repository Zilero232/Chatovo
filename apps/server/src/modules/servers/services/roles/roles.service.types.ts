import type { CreateRoleRequest, ReorderRolesRequest, UpdateRoleRequest } from '@chatovo/schemas';

export type ListRolesInput = {
  serverId: string;
  userId: string;
};

export type CreateRoleInput = {
  serverId: string;
  input: CreateRoleRequest;
  userId: string;
};

export type UpdateRoleInput = {
  serverId: string;
  roleId: string;
  input: UpdateRoleRequest;
  userId: string;
};

export type ReorderRolesInput = {
  serverId: string;
  input: ReorderRolesRequest;
  userId: string;
};

export type DeleteRoleInput = {
  serverId: string;
  roleId: string;
  userId: string;
};
