'use client';

import type { AbuseReason, ReportAbuseFormValues, ReportAbuseValues } from '@chatovo/schemas';

import { abuseReasonSchema, reportAbuseSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage, useFieldError } from '@/entities/app/locale';
import {
  FormField,
  Label,
  RadioGroup,
  RadioGroupItem,
  Stack,
  SubmitButton,
  Textarea
} from '@/ui-kit';

import type { ReportAbuseFormProps } from './ReportAbuseForm.types';

import { useReportAbuse } from '../../../../model/hooks';

import s from '../../ReportAbuseDialog.module.scss';

const REASONS = abuseReasonSchema.options;

export const ReportAbuseForm = ({ target, targetId, onSent }: ReportAbuseFormProps) => {
  const t = useTranslations('moderation');
  const fieldError = useFieldError('moderation');
  const errorMessage = useErrorMessage();
  const { isPending, mutate } = useReportAbuse();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register
  } = useForm<ReportAbuseFormValues, unknown, ReportAbuseValues>({
    resolver: zodResolver(reportAbuseSchema),
    defaultValues: { target, targetId, reason: 'harassment', comment: '' }
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('sent'), { id: 'report-abuse' });
        onSent();
      },
      onError: (err: Error) => toast.error(errorMessage(err), { id: 'report-abuse' })
    });
  });

  return (
    <Stack as='form' gap='4' onSubmit={onSubmit}>
      <FormField
        error={errors.reason && fieldError(errors.reason)}
        htmlFor='abuse-reason'
        label={t('reasonLabel')}
      >
        <Controller
          render={({ field }) => (
            <RadioGroup
              className={s.reasons}
              id='abuse-reason'
              value={field.value}
              onValueChange={(value) => field.onChange(value as AbuseReason)}
            >
              {REASONS.map((reason) => (
                <Label key={reason} className={s.reason} htmlFor={`abuse-reason-${reason}`}>
                  <RadioGroupItem id={`abuse-reason-${reason}`} value={reason} />
                  {t(`reasons.${reason}`)}
                </Label>
              ))}
            </RadioGroup>
          )}
          control={control}
          name='reason'
        />
      </FormField>

      <FormField
        error={errors.comment && fieldError(errors.comment)}
        hint={t('commentHint')}
        htmlFor='abuse-comment'
        label={t('commentLabel')}
      >
        <Textarea
          id='abuse-comment'
          placeholder={t('commentPlaceholder')}
          {...register('comment')}
        />
      </FormField>

      <SubmitButton className={s.submit} isPending={isPending}>
        {t('submit')}
      </SubmitButton>
    </Stack>
  );
};
