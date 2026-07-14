'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
import { ProfileCard } from '../ProfileCard';
import s from './ProfileCardTrigger.module.scss';
import type { ProfileCardTriggerProps } from './ProfileCardTrigger.types';

export const ProfileCardTrigger = ({ identity, name, children }: ProfileCardTriggerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className={s.content} sideOffset={8}>
        <ProfileCard identity={identity} name={name} />
      </PopoverContent>
    </Popover>
  );
};
