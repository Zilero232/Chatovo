'use client';

import { clsx } from 'clsx';
import { Heading, Text } from 'react-aria-components';

import s from '../../Sheet.module.scss';

import type {
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetTitleProps,
} from '../../Sheet.types';

export const SheetHeader = ({ className, ...props }: SheetHeaderProps) => {
  return <div className={clsx(s.header, className)} data-slot="sheet-header" {...props} />;
};

export const SheetFooter = ({ className, ...props }: SheetFooterProps) => {
  return <div className={clsx(s.footer, className)} data-slot="sheet-footer" {...props} />;
};

export const SheetTitle = ({ className, children, ...props }: SheetTitleProps) => {
  return (
    <Heading className={clsx(s.title, className)} data-slot="sheet-title" slot="title" {...props}>
      {children}
    </Heading>
  );
};

export const SheetDescription = ({ className, children, ...props }: SheetDescriptionProps) => {
  return (
    <Text
      className={clsx(s.description, className)}
      data-slot="sheet-description"
      slot="description"
      {...props}
    >
      {children}
    </Text>
  );
};
