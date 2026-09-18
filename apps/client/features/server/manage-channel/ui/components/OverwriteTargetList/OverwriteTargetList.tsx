'use client';

import { clsx } from 'clsx';
import { Shield, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ScrollArea, Text } from '@/ui-kit';

import type { OverwriteTargetListProps } from './OverwriteTargetList.types';

import s from './OverwriteTargetList.module.scss';

export const OverwriteTargetList = ({
  roles,
  members,
  overwrites,
  selected,
  onSelect
}: OverwriteTargetListProps) => {
  const t = useTranslations('server');

  const overwrittenMembers = new Set(
    overwrites.filter((item) => item.target === 'member').map((item) => item.memberId)
  );

  const visibleMembers = members.filter((member) => overwrittenMembers.has(member.id));

  return (
    <ScrollArea className={s.root}>
      <Text className={s.heading} size='xs' tone='muted' weight='medium'>
        {t('roles.title')}
      </Text>
      {roles.map((role) => (
        <button
          key={role.id}
          className={clsx(s.item, { [s.active]: selected?.id === role.id })}
          type='button'
          onClick={() => onSelect({ kind: 'role', id: role.id, label: role.name })}
        >
          <Shield style={role.color ? { color: role.color } : undefined} />
          <span className={s.label}>{role.isDefault ? `@${role.name}` : role.name}</span>
        </button>
      ))}

      <Text className={s.heading} size='xs' tone='muted' weight='medium'>
        {t('members.title')}
      </Text>
      {members.map((member) => {
        const isVisible = visibleMembers.includes(member) || selected?.id === member.id;

        return (
          <button
            key={member.id}
            className={clsx(s.item, s.member, {
              [s.active]: selected?.id === member.id,
              [s.dimmed]: !isVisible
            })}
            type='button'
            onClick={() =>
              onSelect({
                kind: 'member',
                id: member.id,
                label: member.nickname ?? member.displayName
              })
            }
          >
            <User />
            <span className={s.label}>{member.nickname ?? member.displayName}</span>
          </button>
        );
      })}
    </ScrollArea>
  );
};
