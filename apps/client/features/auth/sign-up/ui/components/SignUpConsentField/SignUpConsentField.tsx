'use client';

import type { SignUpFormValues } from '@chatovo/schemas';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Controller, useFormContext } from 'react-hook-form';

import { useFieldError } from '@/entities/app/locale';
import { LEGAL } from '@/shared/config';
import { Checkbox, Label, Text } from '@/ui-kit';

import s from './SignUpConsentField.module.scss';

export const SignUpConsentField = () => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');

  const { control } = useFormContext<SignUpFormValues>();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <div className={s.root}>
          <Label className={s.row} htmlFor='signup-terms'>
            <Checkbox
              aria-invalid={Boolean(fieldState.error)}
              checked={field.value}
              id='signup-terms'
              name={field.name}
              onCheckedChange={field.onChange}
            />

            <Text as='span' size='xs' tone='muted'>
              {t.rich('consentLabel', {
                terms: (chunks) => (
                  <Link className={s.link} href={LEGAL.termsPath} target='_blank'>
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link className={s.link} href={LEGAL.privacyPath} target='_blank'>
                    {chunks}
                  </Link>
                )
              })}
            </Text>
          </Label>

          {fieldState.error && (
            <Text role='alert' size='xs' tone='destructive'>
              {fieldError(fieldState.error)}
            </Text>
          )}
        </div>
      )}
      control={control}
      name='acceptedTerms'
    />
  );
};
