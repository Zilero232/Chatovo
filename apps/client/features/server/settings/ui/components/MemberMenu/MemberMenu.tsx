'use client';

import { MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/ui-kit';

import type { MemberMenuProps } from './MemberMenu.types';

import { useMemberActions } from '../../../model/hooks';
import { MemberMenuDialogs, MemberMenuItems } from './components';

export const MemberMenu = ({
  member,
  roles,
  serverId,
  canBan,
  canKick,
  canManageNickname,
  canManageRoles,
  canTimeout
}: MemberMenuProps) => {
  const t = useTranslations('server.members');

  const actions = useMemberActions({ member, serverId });

  const assignable = roles.filter((role) => !role.isDefault);
  const hasAnyAction = canKick || canBan || canManageNickname || canManageRoles || canTimeout;

  if (!hasAnyAction) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label={t('title')} size='icon-xs' variant='ghost'>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <MemberMenuItems
            assignable={assignable}
            canBan={canBan}
            canKick={canKick}
            canManageNickname={canManageNickname}
            canManageRoles={canManageRoles}
            canTimeout={canTimeout}
            roleIds={member.roleIds}
            onOpenDialog={actions.open}
            onToggleRole={actions.toggleRole}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <MemberMenuDialogs
        dialog={actions.dialog}
        isBanning={actions.isBanning}
        isKicking={actions.isKicking}
        member={member}
        serverId={serverId}
        onBan={actions.ban}
        onClose={actions.close}
        onKick={actions.kick}
      />
    </>
  );
};
