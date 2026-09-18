'use client';

import type { ServerRole } from '@chatovo/schemas';

import { parsePermissions, serializePermissions } from '@chatovo/schemas';
import { useState } from 'react';
import { isNonNullish, isNullish } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import {
  useCreateRole,
  useDeleteRole,
  useReorderRoles,
  useServerRoles,
  useUpdateRole
} from '@/entities/server/member';

import type { RoleDraft } from './use-role-editor.types';

const toDraft = (role: ServerRole): RoleDraft => ({
  name: role.name,
  color: role.color,
  hoist: role.hoist,
  mentionable: role.mentionable,
  permissions: parsePermissions(role.permissions)
});

export const useRoleEditor = (serverId: string) => {
  const toastError = useToastError();

  const { roles, isLoading } = useServerRoles(serverId);
  const createMutation = useCreateRole(serverId);
  const updateMutation = useUpdateRole(serverId);
  const deleteMutation = useDeleteRole(serverId);
  const reorderMutation = useReorderRoles(serverId);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RoleDraft | null>(null);

  const selected = roles.find((role) => role.id === selectedId) ?? roles.at(0) ?? null;
  const current = draft ?? (selected ? toDraft(selected) : null);

  const select = (roleId: string) => {
    setSelectedId(roleId);
    setDraft(null);
  };

  const patch = (next: Partial<RoleDraft>) => {
    if (isNullish(current)) {
      return;
    }

    setDraft({ ...current, ...next });
  };

  const create = () => {
    createMutation.mutate(
      { name: `new-role-${roles.length + 1}` },
      { onSuccess: (role) => select(role.id), onError: toastError('role-create') }
    );
  };

  const save = () => {
    if (isNullish(selected) || isNullish(draft)) {
      return;
    }

    updateMutation.mutate(
      {
        roleId: selected.id,
        input: {
          name: selected.isDefault ? undefined : draft.name,
          color: draft.color,
          hoist: draft.hoist,
          mentionable: draft.mentionable,
          permissions: serializePermissions(draft.permissions)
        }
      },
      { onSuccess: () => setDraft(null), onError: toastError(`role-update-${selected.id}`) }
    );
  };

  const remove = () => {
    if (isNullish(selected) || selected.isDefault) {
      return;
    }

    deleteMutation.mutate(selected.id, {
      onSuccess: () => select(roles[0]?.id ?? ''),
      onError: toastError(`role-delete-${selected.id}`)
    });
  };

  const move = (roleId: string, direction: -1 | 1) => {
    const ordered = [...roles].sort((a, b) => b.position - a.position);
    const index = ordered.findIndex((role) => role.id === roleId);
    const swapWith = ordered[index + direction];

    if (index < 0 || isNullish(swapWith) || swapWith.isDefault) {
      return;
    }

    reorderMutation.mutate(
      {
        roles: [
          { id: roleId, position: swapWith.position },
          { id: swapWith.id, position: ordered[index].position }
        ]
      },
      { onError: toastError(`role-reorder-${roleId}`) }
    );
  };

  return {
    roles: [...roles].sort((a, b) => b.position - a.position),
    isLoading,
    selected,
    current,
    isDirty: isNonNullish(draft),
    isSaving: updateMutation.isPending || deleteMutation.isPending || createMutation.isPending,
    select,
    patch,
    create,
    save,
    remove,
    move
  };
};
