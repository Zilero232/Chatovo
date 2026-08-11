'use client';

import { clsx } from 'clsx';
import { Check, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { useLiteMotion } from '@/shared/hooks';
import { Button, Tooltip, TooltipContent } from '@/shared/ui';

import type { RoomInviteButtonProps } from './RoomInviteButton.types';

import { useCopyInviteLink } from '../../../model/hooks';
import {
  INVITE_ICON_ANIMATE,
  INVITE_ICON_EXIT,
  INVITE_ICON_INITIAL,
  INVITE_ICON_TRANSITION
} from './RoomInviteButton.motion';

import s from './RoomInviteButton.module.scss';

export const RoomInviteButton = ({ roomId, size = 'lg' }: RoomInviteButtonProps) => {
  const t = useTranslations('room.invite');
  const { copied, copyInviteLink } = useCopyInviteLink(roomId);
  const { resolveTransition } = useLiteMotion();

  return (
    <Tooltip>
      <Button
        className={clsx(
          s.button,
          size === 'sm' ? s.buttonSm : s.buttonLg,
          copied && s.buttonCopied
        )}
        aria-label={copied ? t('linkCopied') : t('copyLink')}
        size={size === 'sm' ? 'icon-sm' : 'icon-lg'}
        type='button'
        variant='ghost'
        onClick={copyInviteLink}
      >
        <AnimatePresence initial={false} mode='popLayout'>
          <motion.span
            key={copied ? 'copied' : 'idle'}
            animate={INVITE_ICON_ANIMATE}
            className={s.iconSlot}
            exit={INVITE_ICON_EXIT}
            initial={INVITE_ICON_INITIAL}
            transition={resolveTransition(INVITE_ICON_TRANSITION)}
          >
            {copied ? <Check /> : <Link2 />}
          </motion.span>
        </AnimatePresence>
      </Button>
      <TooltipContent>{copied ? t('linkCopied') : t('tooltip')}</TooltipContent>
    </Tooltip>
  );
};
