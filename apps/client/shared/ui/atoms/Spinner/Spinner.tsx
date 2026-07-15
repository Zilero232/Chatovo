'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { spinnerVariants } from './Spinner.variants';

import type { SpinnerProps } from './Spinner.types';

export const Spinner = ({
  className,
  size = 'sm',
  decorative = false,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  ...props
}: SpinnerProps) => {
  const t = useTranslations('common');
  const isDecorative = decorative || ariaHidden === true;
  const label = isDecorative ? undefined : (ariaLabel ?? t('loading'));

  return (
    <Loader2
      aria-hidden={isDecorative ? true : undefined}
      aria-label={label}
      className={spinnerVariants({ size, className })}
      role={isDecorative ? undefined : 'status'}
      {...props}
    />
  );
};
