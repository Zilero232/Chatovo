'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Check, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { buildRoomHref } from '@/shared/constants';
import { buildPublicAppUrl } from '@/shared/lib/app-url';
import s from './InviteParticipantCard.module.scss';
import type { InviteParticipantCardProps } from './InviteParticipantCard.types';

const COPIED_RESET_MS = 2000;

export const InviteParticipantCard = ({ roomId }: InviteParticipantCardProps) => {
  const t = useTranslations('room.invite');
  const { copy } = useCopy();
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const copyInviteLink = () => {
    copy(buildPublicAppUrl(buildRoomHref(roomId)));
    setCopied(true);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, COPIED_RESET_MS);
  };

  return (
    <button className={clsx(s.root, copied && s.rootCopied)} type="button" onClick={copyInviteLink}>
      {copied ? <Check className={clsx(s.icon, s.iconCopied)} /> : <UserPlus className={s.icon} />}
      <span className={clsx(s.label, copied && s.labelCopied)}>
        {copied ? t('linkCopied') : t('soloSlot')}
      </span>
    </button>
  );
};
