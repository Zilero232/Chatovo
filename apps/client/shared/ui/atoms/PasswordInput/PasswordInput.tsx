'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '../Input';
import s from './PasswordInput.module.scss';
import type { PasswordInputProps } from './PasswordInput.types';

export const PasswordInput = ({ className, disabled, ...props }: PasswordInputProps) => {
  const t = useTranslations('common');
  const [isVisible, toggleVisible] = useBoolean(false);

  return (
    <div className={s.root}>
      <Input
        className={clsx(s.input, className)}
        disabled={disabled}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />

      <button
        aria-label={t(isVisible ? 'hidePassword' : 'showPassword')}
        className={s.toggle}
        disabled={disabled}
        onClick={() => toggleVisible()}
        tabIndex={-1}
        type="button"
      >
        {isVisible ? <EyeOff className={s.icon} /> : <Eye className={s.icon} />}
      </button>
    </div>
  );
};
