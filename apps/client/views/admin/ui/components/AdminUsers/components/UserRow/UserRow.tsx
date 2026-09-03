'use client';

import { Ban, Eye, Pencil, ShieldOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useUnblockUser } from '@/entities/app/admin';
import { useErrorMessage } from '@/entities/app/locale';
import { UserAvatar } from '@/entities/auth/user';
import { IconButtonWithTooltip, Row, Stack, Text } from '@/ui-kit';

import type { UserRowProps } from './UserRow.types';

import { formatAdminDate } from '../../../../../lib';
import { BlockUserDialog } from '../BlockUserDialog/BlockUserDialog';
import { EditUserDialog } from '../EditUserDialog/EditUserDialog';
import { UserBadges } from '../UserBadges/UserBadges';
import { UserDetailsDialog } from '../UserDetailsDialog/UserDetailsDialog';

import s from './UserRow.module.scss';

export const UserRow = ({ user }: UserRowProps) => {
  const t = useTranslations('admin');
  const errorMessage = useErrorMessage();
  const unblock = useUnblockUser();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);

  const name = user.displayName ?? user.name;

  const handleUnblock = () =>
    unblock.mutate(user.id, {
      onSuccess: () => toast.success(t('users.unblocked_toast'), { id: 'unblock-user' }),
      onError: (error: Error) => toast.error(errorMessage(error), { id: 'unblock-user' })
    });

  return (
    <Row align='center' as='article' className={s.root} gap='3'>
      <UserAvatar colorize name={name} size='sm' src={user.avatarUrl} />

      <Stack className={s.info} gap='1'>
        <Row wrap align='center' gap='2'>
          <Text truncate size='sm' weight='medium'>
            {name}
          </Text>

          <UserBadges user={user} />
        </Row>

        <Text truncate size='xs' tone='muted'>
          {user.email} · {user.friendTag} ·{' '}
          {t('users.joined', { date: formatAdminDate(user.createdAt) })}
        </Text>

        <Text size='xs' tone='muted'>
          {t('users.roomsCount', { count: user.roomsCount })} ·{' '}
          {t('users.messagesCount', { count: user.messagesCount })}
        </Text>
      </Stack>

      <Row className={s.actions} gap='1'>
        <IconButtonWithTooltip
          icon={<Eye />}
          label={t('users.details')}
          size='icon-sm'
          tooltipSide='top'
          onClick={() => setIsDetailsOpen(true)}
        />

        <IconButtonWithTooltip
          icon={<Pencil />}
          label={t('users.edit')}
          size='icon-sm'
          tooltipSide='top'
          onClick={() => setIsEditOpen(true)}
        />

        {user.blockedAt ? (
          <IconButtonWithTooltip
            disabled={unblock.isPending}
            icon={<ShieldOff />}
            label={t('users.unblock')}
            size='icon-sm'
            tooltipSide='top'
            onClick={handleUnblock}
          />
        ) : (
          <IconButtonWithTooltip
            icon={<Ban />}
            label={t('users.block')}
            size='icon-sm'
            tooltipSide='top'
            onClick={() => setIsBlockOpen(true)}
          />
        )}
      </Row>

      <UserDetailsDialog open={isDetailsOpen} user={user} onOpenChange={setIsDetailsOpen} />
      <EditUserDialog open={isEditOpen} user={user} onOpenChange={setIsEditOpen} />
      <BlockUserDialog open={isBlockOpen} user={user} onOpenChange={setIsBlockOpen} />
    </Row>
  );
};
