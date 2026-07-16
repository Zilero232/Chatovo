'use client';

import { type ReportProblemValues, reportProblemSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage, useFieldError } from '@/entities/app/locale';
import { FilePicker, FormField, Stack, SubmitButton, Textarea } from '@/shared/ui';
import { useReportProblem } from '../../../../model/use-report-problem';

import s from '../../ReportProblemDialog.module.scss';

import type { ReportProblemFormProps } from './ReportProblemForm.types';

const DEFAULT_VALUES: ReportProblemValues = { description: '' };

export const ReportProblemForm = ({ onSent }: ReportProblemFormProps) => {
  const t = useTranslations('feedback');
  const fieldError = useFieldError('feedback');
  const errorMessage = useErrorMessage();
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

  const onSubmit = handleSubmit((values) => {
    mutate(
      { ...values, screenshot },
      {
        onSuccess: () => {
          toast.success(t('sent'));
          reset(DEFAULT_VALUES);
          setScreenshot(undefined);
          onSent();
        },
        onError: (err: Error) => toast.error(errorMessage(err)),
      },
    );
  });

  return (
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
        <FilePicker
          accept="image/*"
          file={screenshot}
          id="report-screenshot"
          onSelect={setScreenshot}
        />
      </FormField>

      <SubmitButton className={s.submit} isPending={isPending}>
        {t('submit')}
      </SubmitButton>
    </Stack>
  );
};
