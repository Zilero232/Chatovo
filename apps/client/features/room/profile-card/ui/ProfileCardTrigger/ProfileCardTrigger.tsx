'use client';

import { clsx } from 'clsx';
import { useRef, useState } from 'react';

import { PopoverContent } from '@/shared/ui';

import type { ProfileCardTriggerProps } from './ProfileCardTrigger.types';

import { ProfileCard } from '../ProfileCard';

import s from './ProfileCardTrigger.module.scss';

export const ProfileCardTrigger = ({
  identity,
  name,
  className,
  children,
  renderFriendActions
}: ProfileCardTriggerProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <>
      <button
        ref={triggerRef}
        aria-expanded={isOpen}
        aria-haspopup='dialog'
        className={clsx(s.trigger, className)}
        type='button'
        onClick={() => {
          setHasOpened(true);
          setIsOpen(true);
        }}
      >
        {children}
      </button>

      {hasOpened && (
        <PopoverContent
          align='start'
          className={s.content}
          isOpen={isOpen}
          sideOffset={8}
          triggerRef={triggerRef}
          onOpenChange={setIsOpen}
        >
          <ProfileCard identity={identity} name={name} renderFriendActions={renderFriendActions} />
        </PopoverContent>
      )}
    </>
  );
};
