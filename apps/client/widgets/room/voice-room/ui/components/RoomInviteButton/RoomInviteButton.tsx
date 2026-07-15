'use client';

import { clsx } from 'clsx';
import { Check, Link2 } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { Button, Tooltip, TooltipContent } from '@/shared/ui';
import { useCopyInviteLink } from '../../../model/hooks';

import s from './RoomInviteButton.module.scss';

import type { RoomInviteButtonProps } from './RoomInviteButton.types';

export const RoomInviteButton = ({ roomId, size = 'lg' }: RoomInviteButtonProps) => {
  const t = useTranslations('room.invite');
  const { copied, copyInviteLink } = useCopyInviteLink(roomId);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Tooltip>
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
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copied ? 'copied' : 'idle'}
            className={s.iconSlot}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.3, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.3 }}
            transition={{ type: 'spring', stiffness: 520, damping: 24 }}
          >
            {copied ? <Check /> : <Link2 />}
          </motion.span>
        </AnimatePresence>
      </Button>
      <TooltipContent>{copied ? t('linkCopied') : t('tooltip')}</TooltipContent>
    </Tooltip>
  );
};
