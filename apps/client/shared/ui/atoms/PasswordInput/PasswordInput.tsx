'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Input } from '../Input';

import s from './PasswordInput.module.scss';

import type { PasswordInputProps } from './PasswordInput.types';

export const PasswordInput = ({ className, disabled, id, ...props }: PasswordInputProps) => {
  const t = useTranslations('common');
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const [isVisible, toggleVisible] = useBoolean(false);

  return (
    <div className={s.root}>
      <Input
        className={clsx(s.input, className)}
        disabled={disabled}
        id={inputId}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />

      <button
        aria-controls={inputId}
        aria-label={t(isVisible ? 'hidePassword' : 'showPassword')}
        aria-pressed={isVisible}
        className={s.toggle}
        disabled={disabled}
        onClick={() => toggleVisible()}
        tabIndex={-1}
        type="button"
      >
        {isVisible ? (
          <EyeOff aria-hidden className={s.icon} />
        ) : (
          <Eye aria-hidden className={s.icon} />
        )}
      </button>
    </div>
  );
};
