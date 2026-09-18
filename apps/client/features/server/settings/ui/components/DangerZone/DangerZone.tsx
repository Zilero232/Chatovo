'use client';

import { LogOut, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser } from '@/entities/auth/user';
import { useDeleteServer, useLeaveServer } from '@/entities/server/server';
import { ROUTES } from '@/shared/constants';
import { Button, ConfirmDialog, Row, Text } from '@/ui-kit';

import type { DangerZoneProps } from './DangerZone.types';

import s from './DangerZone.module.scss';

export const DangerZone = ({ server, onClose }: DangerZoneProps) => {
  const router = useRouter();

  const t = useTranslations('server.settings');
  const tCommon = useTranslations('common');
  const toastError = useToastError();

  const { user } = useCurrentUser();
  const leaveMutation = useLeaveServer();
  const deleteMutation = useDeleteServer();

  const [confirming, setConfirming] = useState<'delete' | 'leave' | null>(null);

  const isOwner = user?.id === server.ownerId;

  const finish = () => {
    setConfirming(null);
    onClose();
    router.replace(ROUTES.lobby);
  };

  const confirm = () => {
    if (confirming === 'delete') {
      deleteMutation.mutate(server.id, {
        onSuccess: finish,
        onError: toastError(`server-delete-${server.id}`)
      });
    } else {
      leaveMutation.mutate(server.id, {
        onSuccess: finish,
        onError: toastError(`server-leave-${server.id}`)
      });
    }
  };

  return (
    <Row align='center' className={s.root} gap='3' justify='between'>
      <Text size='sm' tone='muted'>
        {isOwner ? t('delete') : t('leave')}
      </Text>

      <Button
        size='sm'
        type='button'
        variant='destructive'
        onClick={() => setConfirming(isOwner ? 'delete' : 'leave')}
      >
        {isOwner ? <Trash2 /> : <LogOut />}
        {isOwner ? t('delete') : t('leave')}
      </Button>

      <ConfirmDialog
        description={t(confirming === 'delete' ? 'deleteConfirm' : 'leaveConfirm', {
          name: server.name
        })}
        cancelLabel={tCommon('cancel')}
        confirmLabel={confirming === 'delete' ? t('delete') : t('leave')}
        isPending={deleteMutation.isPending || leaveMutation.isPending}
        open={confirming !== null}
        title={confirming === 'delete' ? t('delete') : t('leave')}
        onConfirm={confirm}
        onOpenChange={(open) => !open && setConfirming(null)}
      />
    </Row>
  );
};
