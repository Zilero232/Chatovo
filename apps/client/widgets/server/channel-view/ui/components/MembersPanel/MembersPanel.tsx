'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { sortBy } from 'remeda';

import { UserAvatar } from '@/entities/auth/user';
import { useServerMembers, useServerRoles } from '@/entities/server/member';
import { useServerById } from '@/entities/server/server';
import { ScrollArea, Text } from '@/ui-kit';

import type { MembersPanelProps } from './MembersPanel.types';

import s from './MembersPanel.module.scss';

export const MembersPanel = ({ serverId }: MembersPanelProps) => {
  const t = useTranslations('server.members');

  const { server } = useServerById(serverId);
  const { members } = useServerMembers(serverId);
  const { roles } = useServerRoles(serverId);

  const hoisted = sortBy(
    roles.filter((role) => role.hoist && !role.isDefault),
    (role) => -role.position
  );

  const claimed = new Set<string>();
  const sections = hoisted.map((role) => {
    const list = members.filter(
      (member) => !claimed.has(member.id) && member.roleIds.includes(role.id)
    );

    list.forEach((member) => claimed.add(member.id));

    return { key: role.id, label: role.name, color: role.color, members: list };
  });

  const rest = members.filter((member) => !claimed.has(member.id));

  const groups = [
    ...sections,
    { key: 'rest', label: t('title'), color: null, members: rest }
  ].filter((group) => group.members.length > 0);

  return (
    <aside className={s.root}>
      <ScrollArea className={s.scroll}>
        {groups.map((group) => (
          <section key={group.key} className={s.group}>
            <Text className={s.label} size='xs' tone='muted' weight='medium'>
              {group.label} — {group.members.length}
            </Text>
            {group.members.map((member) => (
              <div key={member.id} className={s.member}>
                <UserAvatar
                  name={member.nickname ?? member.displayName}
                  size='sm'
                  src={member.avatarUrl}
                />
                <span className={s.name} style={group.color ? { color: group.color } : undefined}>
                  {member.nickname ?? member.displayName}
                </span>
                {member.userId === server?.ownerId && (
                  <Crown aria-label={t('owner')} className={s.crown} />
                )}
              </div>
            ))}
          </section>
        ))}
      </ScrollArea>
    </aside>
  );
};
