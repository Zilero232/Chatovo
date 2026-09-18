'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { useChannelPermissions } from '@/entities/server/channel';
import { useServerMembers, useServerRoles } from '@/entities/server/member';
import { ScrollArea, SearchField, Stack, Text } from '@/ui-kit';

import type { MembersTabProps } from './MembersTab.types';

import { MemberRow } from '../MemberRow/MemberRow';

export const MembersTab = ({ server }: MembersTabProps) => {
  const t = useTranslations('server.members');

  const { user } = useCurrentUser();
  const { members } = useServerMembers(server.id);
  const { roles } = useServerRoles(server.id);
  const { can } = useChannelPermissions({ serverId: server.id, channelId: null });

  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const visible = members.filter((member) =>
    `${member.displayName} ${member.nickname ?? ''}`.toLowerCase().includes(needle)
  );

  return (
    <Stack gap='2'>
      <SearchField placeholder={t('title')} value={query} onValueChange={setQuery} />
      <Text size='xs' tone='muted'>
        {t('count', { count: members.length })}
      </Text>

      <ScrollArea>
        {visible.map((member) => (
          <MemberRow
            key={member.id}
            canManageNickname={
              can('manageNicknames') || (member.userId === user?.id && can('changeNickname'))
            }
            canBan={can('banMembers') && member.userId !== user?.id}
            canKick={can('kickMembers') && member.userId !== user?.id}
            canManageRoles={can('manageRoles')}
            canTimeout={can('muteMembers') && member.userId !== user?.id}
            isOwner={member.userId === server.ownerId}
            member={member}
            roles={roles}
            serverId={server.id}
          />
        ))}
      </ScrollArea>
    </Stack>
  );
};
