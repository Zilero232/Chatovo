'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { Check, Copy, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useRevokeInvite } from '@/entities/server/invite';
import { buildInviteHref, buildPublicAppUrl } from '@/shared/lib';
import { Button, Text } from '@/ui-kit';

import type { InviteRowProps } from './InviteRow.types';

import s from './InviteRow.module.scss';

export const InviteRow = ({ invite, serverId }: InviteRowProps) => {
  const t = useTranslations('server.invites');
  const toastError = useToastError();

  const revokeMutation = useRevokeInvite(serverId);
  const { copied, copy } = useCopy();

  const link = buildPublicAppUrl(buildInviteHref(invite.code));
  const usage = invite.maxUses
    ? t('uses', { used: invite.uses, max: invite.maxUses })
    : t('usesUnlimited', { used: invite.uses });

  const copyLink = () => {
    copy(link);
    toast.success(t('copied'), { id: `invite-copy-${invite.id}` });
  };

  return (
    <div className={s.root}>
      <div className={s.info}>
        <span className={s.code}>{invite.code}</span>
        <Text size='xs' tone='muted'>
          {usage}
          {invite.expiresAt && ` · ${new Date(invite.expiresAt).toLocaleString()}`}
        </Text>
      </div>

      <Button
        aria-label={t('copy')}
        size='icon-sm'
        type='button'
        variant='ghost'
        onClick={copyLink}
      >
        {copied ? <Check /> : <Copy />}
      </Button>

      <Button
        aria-label={t('revoke')}
        disabled={revokeMutation.isPending}
        size='icon-sm'
        type='button'
        variant='ghost'
        onClick={() =>
          revokeMutation.mutate(invite.id, { onError: toastError(`invite-revoke-${invite.id}`) })
        }
      >
        <Trash2 />
      </Button>
    </div>
  );
};
