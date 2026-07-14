'use client';

import { XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '../../atoms/Button';

import type { OverlayCloseButtonProps } from './OverlayCloseButton.types';

export const OverlayCloseButton = ({ className, onPress, ...props }: OverlayCloseButtonProps) => {
  const t = useTranslations('common');

  return (
    <Button
      aria-label={t('close')}
      className={className}
      size="icon-xs"
      variant="ghost"
      onPress={onPress}
      {...props}
    >
      <XIcon aria-hidden />
    </Button>
  );
};
