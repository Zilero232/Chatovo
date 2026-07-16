'use client';

import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatBadgeCount } from '@/shared/lib';
import { IconButtonWithTooltip } from '@/shared/ui';

import s from '../../FriendsDialog.module.scss';

import type { FriendsDialogTriggerProps } from './FriendsDialogTrigger.types';

export const FriendsDialogTrigger = ({ badgeCount, onOpen }: FriendsDialogTriggerProps) => {
  const t = useTranslations('friends');

  return (
    <div className={s.triggerWrap}>
      <IconButtonWithTooltip icon={<Users />} label={t('title')} variant="ghost" onClick={onOpen} />
      {badgeCount > 0 && <span className={s.triggerBadge}>{formatBadgeCount(badgeCount)}</span>}
    </div>
  );
};
