'use client';

import { clsx } from 'clsx';
import { useRef, useState } from 'react';

import { Popover, PopoverContent } from '@/shared/ui';
import { ProfileCard } from '../ProfileCard';

import s from './ProfileCardTrigger.module.scss';

import type { ProfileCardTriggerProps } from './ProfileCardTrigger.types';

export const ProfileCardTrigger = ({
  identity,
  name,
  className,
  children,
}: ProfileCardTriggerProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        ref={triggerRef}
        className={clsx(s.trigger, className)}
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {children}
      </button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverContent
          align="start"
          className={s.content}
          isNonModal={false}
          sideOffset={8}
          triggerRef={triggerRef}
        >
          <ProfileCard identity={identity} name={name} />
        </PopoverContent>
      </Popover>
    </>
  );
};
