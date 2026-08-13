'use client';

import type { MouseEvent } from 'react';

import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';
import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { openExternal } from '@/shared/lib';
import { Tooltip, TooltipContent } from '@/shared/ui';

import type { UserNameProps } from './UserName.types';

import { DeveloperBadge } from '../DeveloperBadge';

import s from './UserName.module.scss';

const checkSizeClass = {
  sm: s.checkSm,
  md: s.checkMd
} as const;

export const UserName = ({
  className,
  developer = false,
  name,
  profileUrl = null,
  size = 'sm',
  verified = false
}: UserNameProps) => {
  const t = useTranslations('user');

  const check = verified ? (
    <Tooltip>
      <span aria-label={t('verified')} className={s.checkWrap} role='img'>
        <BadgeCheck className={clsx(s.check, checkSizeClass[size])} />
      </span>
      <TooltipContent sideOffset={6}>{t('verified')}</TooltipContent>
    </Tooltip>
  ) : null;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();

    if (!profileUrl || !isTauri()) {
      return;
    }

    event.preventDefault();

    openExternal(profileUrl);
  };

  return (
    <span className={s.root}>
      {profileUrl ? (
        <a
          className={clsx(s.link, developer && s.developerName, className)}
          href={profileUrl}
          rel='noreferrer noopener'
          target='_blank'
          onClick={handleClick}
        >
          {name}
        </a>
      ) : (
        <span className={clsx(s.text, developer && s.developerName, className)}>{name}</span>
      )}
      {check}
      {developer && <DeveloperBadge size={size} />}
    </span>
  );
};
