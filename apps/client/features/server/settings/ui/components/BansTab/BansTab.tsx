'use client';

import { UserRoundX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import { UserAvatar } from '@/entities/auth/user';
import { useChannelPermissions } from '@/entities/server/channel';
import { useServerBans, useUnbanMember } from '@/entities/server/member';
import { Button, ScrollArea, Skeleton, Stack, Text } from '@/ui-kit';

import type { BansTabProps } from './BansTab.types';

import s from './BansTab.module.scss';

export const BansTab = ({ serverId }: BansTabProps) => {
  const t = useTranslations('server.bans');
  const toastError = useToastError();

  const { bans, isLoading } = useServerBans(serverId);
  const { can } = useChannelPermissions({ serverId, channelId: null });
  const unbanMutation = useUnbanMember(serverId);

  const canUnban = can('banMembers');

  if (isLoading) {
    return <Skeleton className={s.skeleton} />;
  }

  if (isEmpty(bans)) {
    return (
      <Text size='sm' tone='muted'>
        {t('empty')}
      </Text>
    );
  }

  return (
    <Stack gap='2'>
      <ScrollArea>
        {bans.map((ban) => (
          <div key={ban.id} className={s.row}>
            <UserAvatar name={ban.displayName} size='sm' src={ban.avatarUrl} />

            <div className={s.info}>
              <span className={s.name}>{ban.displayName}</span>
              {ban.reason && (
                <Text size='xs' tone='muted'>
                  {ban.reason}
                </Text>
              )}
            </div>

            {canUnban && (
              <Button
                disabled={unbanMutation.isPending}
                size='sm'
                type='button'
                variant='outline'
                onClick={() =>
                  unbanMutation.mutate(ban.userId, { onError: toastError(`unban-${ban.id}`) })
                }
              >
                <UserRoundX />
                {t('unban')}
              </Button>
            )}
          </div>
        ))}
      </ScrollArea>
    </Stack>
  );
};
