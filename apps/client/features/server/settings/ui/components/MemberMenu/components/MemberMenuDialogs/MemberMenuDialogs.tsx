'use client';

import { useTranslations } from 'next-intl';

import { ConfirmDialog } from '@/ui-kit';

import type { MemberMenuDialogsProps } from './MemberMenuDialogs.types';

import { NicknameDialog } from '../../../NicknameDialog/NicknameDialog';
import { TimeoutDialog } from '../../../TimeoutDialog/TimeoutDialog';

export const MemberMenuDialogs = ({
  member,
  serverId,
  dialog,
  isBanning,
  isKicking,
  onBan,
  onClose,
  onKick
}: MemberMenuDialogsProps) => {
  const t = useTranslations('server.members');
  const tCommon = useTranslations('common');

  const name = member.nickname ?? member.displayName;

  return (
    <>
      <NicknameDialog
        member={member}
        open={dialog === 'nickname'}
        serverId={serverId}
        onOpenChange={onClose}
      />

      <TimeoutDialog
        member={member}
        open={dialog === 'timeout'}
        serverId={serverId}
        onOpenChange={onClose}
      />

      <ConfirmDialog
        cancelLabel={tCommon('cancel')}
        confirmLabel={t('kick')}
        description={t('kickConfirm', { name })}
        isPending={isKicking}
        open={dialog === 'kick'}
        title={t('kick')}
        onConfirm={onKick}
        onOpenChange={onClose}
      />

      <ConfirmDialog
        cancelLabel={tCommon('cancel')}
        confirmLabel={t('ban')}
        description={t('banConfirm', { name })}
        isPending={isBanning}
        open={dialog === 'ban'}
        title={t('ban')}
        onConfirm={onBan}
        onOpenChange={onClose}
      />
    </>
  );
};
