'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Check, Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { buildRoomHref } from '@/shared/constants';
import { buildPublicAppUrl } from '@/shared/lib/app-url';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import s from './RoomInviteButton.module.scss';
import type { RoomInviteButtonProps } from './RoomInviteButton.types';

const COPIED_RESET_MS = 2000;

export const RoomInviteButton = ({ roomId, size = 'lg' }: RoomInviteButtonProps) => {
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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={copied ? t('linkCopied') : t('copyLink')}
          className={clsx(
            s.button,
            size === 'sm' ? s.buttonSm : s.buttonLg,
            copied && s.buttonCopied,
          )}
          size={size === 'sm' ? 'icon-sm' : 'icon-lg'}
          type="button"
          variant="ghost"
          onClick={copyInviteLink}
        >
          {copied ? <Check /> : <Link2 />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? t('linkCopied') : t('tooltip')}</TooltipContent>
    </Tooltip>
  );
};
