'use client';

import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import { useChannelPermissions } from '@/entities/server/channel';
import { useServerInvites } from '@/entities/server/invite';
import { ScrollArea, Skeleton, Stack, Text } from '@/ui-kit';

import type { InvitesTabProps } from './InvitesTab.types';

import { CreateInviteForm } from '../CreateInviteForm/CreateInviteForm';
import { InviteRow } from '../InviteRow/InviteRow';

export const InvitesTab = ({ serverId }: InvitesTabProps) => {
  const t = useTranslations('server.invites');

  const { invites, isLoading } = useServerInvites(serverId);
  const { can } = useChannelPermissions({ serverId, channelId: null });

  return (
    <Stack gap='3'>
      {can('createInvite') && <CreateInviteForm serverId={serverId} />}

      {isLoading && <Skeleton style={{ height: '8rem' }} />}

      {!isLoading && isEmpty(invites) ? (
        <Text size='sm' tone='muted'>
          {t('empty')}
        </Text>
      ) : (
        <ScrollArea>
          {invites.map((invite) => (
            <InviteRow key={invite.id} invite={invite} serverId={serverId} />
          ))}
        </ScrollArea>
      )}
    </Stack>
  );
};
