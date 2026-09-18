'use client';

import type { ChannelOverwrite } from '@chatovo/schemas';

import { parsePermissions, serializePermissions } from '@chatovo/schemas';
import { useState } from 'react';
import { isNonNullish } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import {
  useChannelOverwrites,
  useDeleteChannelOverwrite,
  usePutChannelOverwrite
} from '@/entities/server/channel';
import { useServerMembers, useServerRoles } from '@/entities/server/member';

import type { OverwriteTarget } from './use-overwrite-editor.types';

const sameTarget = (overwrite: ChannelOverwrite, target: OverwriteTarget) =>
  target.kind === 'role' ? overwrite.roleId === target.id : overwrite.memberId === target.id;

export const useOverwriteEditor = ({
  serverId,
  channelId
}: {
  serverId: string;
  channelId: string;
}) => {
  const toastError = useToastError();

  const { roles } = useServerRoles(serverId);
  const { members } = useServerMembers(serverId);
  const { overwrites, isLoading } = useChannelOverwrites(channelId);
  const putMutation = usePutChannelOverwrite({ serverId, channelId });
  const deleteMutation = useDeleteChannelOverwrite({ serverId, channelId });

  const [target, setTarget] = useState<OverwriteTarget | null>(null);
  const [draft, setDraft] = useState<{ allow: bigint; deny: bigint } | null>(null);

  const current = target ? overwrites.find((item) => sameTarget(item, target)) : undefined;
  const allow = draft?.allow ?? (current ? parsePermissions(current.allow) : 0n);
  const deny = draft?.deny ?? (current ? parsePermissions(current.deny) : 0n);

  const select = (next: OverwriteTarget) => {
    setTarget(next);
    setDraft(null);
  };

  const save = () => {
    if (!target || !draft) {
      return;
    }

    putMutation.mutate(
      {
        target: target.kind,
        roleId: target.kind === 'role' ? target.id : undefined,
        memberId: target.kind === 'member' ? target.id : undefined,
        allow: serializePermissions(draft.allow),
        deny: serializePermissions(draft.deny)
      },
      { onSuccess: () => setDraft(null), onError: toastError(`overwrite-put-${channelId}`) }
    );
  };

  const remove = () => {
    if (!current) {
      return;
    }

    deleteMutation.mutate(current.id, {
      onSuccess: () => setDraft(null),
      onError: toastError(`overwrite-delete-${current.id}`)
    });
  };

  return {
    roles,
    members,
    overwrites,
    isLoading,
    target,
    select,
    allow,
    deny,
    setDraft,
    isDirty: isNonNullish(draft),
    hasOverwrite: isNonNullish(current),
    save,
    remove,
    isSaving: putMutation.isPending || deleteMutation.isPending
  };
};
