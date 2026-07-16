'use client';

import { useTranslations } from 'next-intl';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui';
import { ReportProblemForm } from './components';

import type { ReportProblemDialogProps } from './ReportProblemDialog.types';

export const ReportProblemDialog = ({ open, onOpenChange }: ReportProblemDialogProps) => {
  const t = useTranslations('feedback');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <ReportProblemForm onSent={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
