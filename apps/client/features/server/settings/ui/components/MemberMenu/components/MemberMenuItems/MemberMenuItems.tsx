'use client';

import { Gavel, Pencil, TimerOff, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel
} from '@/ui-kit';

import type { MemberMenuItemsProps } from './MemberMenuItems.types';

export const MemberMenuItems = ({
  assignable,
  roleIds,
  canBan,
  canKick,
  canManageNickname,
  canManageRoles,
  canTimeout,
  onOpenDialog,
  onToggleRole
}: MemberMenuItemsProps) => {
  const t = useTranslations('server.members');

  return (
    <>
      {canManageNickname && (
        <DropdownMenuItem onSelect={() => onOpenDialog('nickname')}>
          <Pencil />
          {t('changeNickname')}
        </DropdownMenuItem>
      )}

      {canTimeout && (
        <DropdownMenuItem onSelect={() => onOpenDialog('timeout')}>
          <TimerOff />
          {t('timeout')}
        </DropdownMenuItem>
      )}

      {canManageRoles && !isEmpty(assignable) && (
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('manageRoles')}</DropdownMenuLabel>
          {assignable.map((role) => (
            <DropdownMenuCheckboxItem
              key={role.id}
              checked={roleIds.includes(role.id)}
              onCheckedChange={(checked) => onToggleRole(role.id, checked)}
            >
              {role.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      )}

      {canKick && (
        <DropdownMenuItem variant='destructive' onSelect={() => onOpenDialog('kick')}>
          <UserX />
          {t('kick')}
        </DropdownMenuItem>
      )}

      {canBan && (
        <DropdownMenuItem variant='destructive' onSelect={() => onOpenDialog('ban')}>
          <Gavel />
          {t('ban')}
        </DropdownMenuItem>
      )}
    </>
  );
};
