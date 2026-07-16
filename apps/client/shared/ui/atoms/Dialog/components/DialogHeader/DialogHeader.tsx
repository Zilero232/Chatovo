'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import { Heading, OverlayTriggerStateContext, Text } from 'react-aria-components';

import { Button } from '../../../Button';

import s from '../../Dialog.module.scss';

import type {
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogTitleProps,
} from '../../Dialog.types';

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return <div className={clsx(s.header, className)} data-slot="dialog-header" {...props} />;
};

export const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) => {
  const t = useTranslations('common');
  const state = useContext(OverlayTriggerStateContext);

  return (
    <div className={clsx(s.footer, className)} data-slot="dialog-footer" {...props}>
      {children}
      {showCloseButton && (
        <Button variant="outline" onPress={() => state?.close()}>
          {t('close')}
        </Button>
      )}
    </div>
  );
};

export const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => {
  return (
    <Heading className={clsx(s.title, className)} data-slot="dialog-title" slot="title" {...props}>
      {children}
    </Heading>
  );
};

export const DialogDescription = ({ className, children, ...props }: DialogDescriptionProps) => {
  return (
    <Text
      className={clsx(s.description, className)}
      data-slot="dialog-description"
      slot="description"
      {...props}
    >
      {children}
    </Text>
  );
};
