'use client';

import { Popover, PopoverContent } from '@/shared/ui';
import { ProfileCard } from '../ProfileCard';

import s from './ProfileCardTrigger.module.scss';

import type { ProfileCardTriggerProps } from './ProfileCardTrigger.types';

export const ProfileCardTrigger = ({ identity, name, children }: ProfileCardTriggerProps) => {
  return (
    <Popover>
      {children}
      <PopoverContent align="start" className={s.content} sideOffset={8}>
        <ProfileCard identity={identity} name={name} />
      </PopoverContent>
    </Popover>
  );
};
