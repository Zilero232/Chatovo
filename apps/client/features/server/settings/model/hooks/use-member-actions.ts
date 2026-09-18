'use client';

import { useState } from 'react';

import { useToastError } from '@/entities/app/locale';
import { useBanMember, useKickMember, useUpdateMember } from '@/entities/server/member';

import type { UseMemberActionsInput, UseMemberActionsOpenDialog } from './use-member-actions.types';

export const useMemberActions = ({ member, serverId }: UseMemberActionsInput) => {
  const toastError = useToastError();

  const updateMutation = useUpdateMember(serverId);
  const kickMutation = useKickMember(serverId);
  const banMutation = useBanMember(serverId);

  const [dialog, setDialog] = useState<UseMemberActionsOpenDialog>(null);

  const close = () => setDialog(null);

  const toggleRole = (roleId: string, checked: boolean) => {
    const roleIds = checked
      ? [...member.roleIds, roleId]
      : member.roleIds.filter((id) => id !== roleId);

    updateMutation.mutate(
      { userId: member.userId, input: { roleIds } },
      { onError: toastError(`member-roles-${member.id}`) }
    );
  };

  const kick = () => {
    kickMutation.mutate(member.userId, {
      onSuccess: close,
      onError: toastError(`member-kick-${member.id}`)
    });
  };

  const ban = () => {
    banMutation.mutate(
      { userId: member.userId, input: {} },
      { onSuccess: close, onError: toastError(`member-ban-${member.id}`) }
    );
  };

  return {
    dialog,
    isKicking: kickMutation.isPending,
    isBanning: banMutation.isPending,
    open: setDialog,
    close,
    toggleRole,
    kick,
    ban
  };
};
