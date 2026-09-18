'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserAvatar } from '@/entities/auth/user';
import { Badge } from '@/ui-kit';

import type { MemberRowProps } from './MemberRow.types';

import { MemberMenu } from '../MemberMenu/MemberMenu';

import s from './MemberRow.module.scss';

export const MemberRow = ({
  member,
  roles,
  serverId,
  isOwner,
  canBan,
  canKick,
  canManageNickname,
  canManageRoles,
  canTimeout
}: MemberRowProps) => {
  const t = useTranslations('server.members');

  const memberRoles = roles.filter((role) => !role.isDefault && member.roleIds.includes(role.id));
  const label = member.nickname ?? member.displayName;

  return (
    <div className={s.root}>
      <UserAvatar className={s.avatar} name={label} size='sm' src={member.avatarUrl} />

      <div className={s.info}>
        <span className={s.name}>
          {label}
          {isOwner && <Crown aria-label={t('owner')} className={s.crown} />}
        </span>
        {member.nickname && <span className={s.subtle}>{member.displayName}</span>}
      </div>

      <div className={s.roles}>
        {memberRoles.map((role) => (
          <Badge
            key={role.id}
            size='sm'
            style={role.color ? { borderColor: role.color, color: role.color } : undefined}
          >
            {role.name}
          </Badge>
        ))}
      </div>

      <MemberMenu
        canBan={canBan && !isOwner}
        canKick={canKick && !isOwner}
        canManageNickname={canManageNickname}
        canManageRoles={canManageRoles && !isOwner}
        canTimeout={canTimeout && !isOwner}
        member={member}
        roles={roles}
        serverId={serverId}
      />
    </div>
  );
};
