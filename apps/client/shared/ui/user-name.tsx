'use client';

import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

const checkSizes = {
  sm: 'size-3.5',
  md: 'size-4',
} as const;

const linkClass =
  'truncate bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-px transition-[background-size,color] duration-200 ease-out hover:text-primary hover:bg-[length:100%_1px]';

type UserNameProps = {
  name: string;
  verified?: boolean;
  profileUrl?: string | null;
  size?: keyof typeof checkSizes;
  className?: string;
};

export const UserName = ({
  name,
  verified = false,
  profileUrl = null,
  size = 'sm',
  className,
}: UserNameProps) => {
  const t = useTranslations('user');

  const check = verified ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span aria-label={t('verified')} className="inline-flex shrink-0 self-center" role="img">
          <BadgeCheck className={cn('fill-sky-500 text-background', checkSizes[size])} />
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{t('verified')}</TooltipContent>
    </Tooltip>
  ) : null;

  return (
    <span className="inline-flex min-w-0 items-center gap-1 leading-none">
      {profileUrl ? (
        <a
          className={cn(linkClass, className)}
          href={profileUrl}
          rel="noreferrer noopener"
          target="_blank"
          onClick={(event) => event.stopPropagation()}
        >
          {name}
        </a>
      ) : (
        <span className={cn('truncate', className)}>{name}</span>
      )}
      {check}
    </span>
  );
};
