'use client';

import { clsx } from 'clsx';
import { Check, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useCopyInviteLink } from '../../../model/hooks';

import s from './InviteParticipantCard.module.scss';

import type { InviteParticipantCardProps } from './InviteParticipantCard.types';

export const InviteParticipantCard = ({ roomId }: InviteParticipantCardProps) => {
  const t = useTranslations('room.invite');
  const { copied, copyInviteLink } = useCopyInviteLink(roomId);

  return (
    <button
      className={clsx(s.root, { [s.rootCopied]: copied })}
      type="button"
      onClick={copyInviteLink}
    >
      {copied ? <Check className={clsx(s.icon, s.iconCopied)} /> : <UserPlus className={s.icon} />}
      <span className={clsx(s.label, { [s.labelCopied]: copied })}>
        {copied ? t('linkCopied') : t('soloSlot')}
      </span>
    </button>
  );
};
