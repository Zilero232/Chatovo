'use client';

import { type ReportProblemValues, reportProblemSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useFieldError } from '@/entities/app/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Stack,
  SubmitButton,
  Textarea,
} from '@/shared/ui';
import { useReportProblem } from '../model/use-report-problem';

import s from './ReportProblemDialog.module.scss';

import type { ReportProblemDialogProps } from './ReportProblemDialog.types';

const DEFAULT_VALUES: ReportProblemValues = { description: '' };

export const ReportProblemDialog = ({ open, onOpenChange }: ReportProblemDialogProps) => {
  const t = useTranslations('feedback');
  const fieldError = useFieldError('feedback');
  const { isPending, mutate } = useReportProblem();

  const [screenshot, setScreenshot] = useState<File | undefined>(undefined);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ReportProblemValues>({
    resolver: zodResolver(reportProblemSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const close = () => {
    reset(DEFAULT_VALUES);

    onOpenChange(false);

    setScreenshot(undefined);
  };

  const onSubmit = handleSubmit((values) => {
    mutate(
      { ...values, screenshot },
      {
        onSuccess: () => {
          toast.success(t('sent'));
          close();
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Stack as="form" gap="4" onSubmit={onSubmit}>
          <FormField
            htmlFor="report-description"
            label={t('descriptionLabel')}
            error={errors.description && fieldError(errors.description)}
          >
            <Textarea
              id="report-description"
              placeholder={t('descriptionPlaceholder')}
              {...register('description')}
            />
          </FormField>

          <FormField
            htmlFor="report-screenshot"
            label={t('screenshotLabel')}
            hint={t('screenshotHint')}
          >
            <Input
              accept="image/*"
              id="report-screenshot"
              type="file"
              onChange={(event) => setScreenshot(event.target.files?.[0])}
            />
          </FormField>

          <SubmitButton className={s.submit} isPending={isPending}>
            {t('submit')}
          </SubmitButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
