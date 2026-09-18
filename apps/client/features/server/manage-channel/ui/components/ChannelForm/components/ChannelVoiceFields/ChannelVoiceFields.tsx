'use client';

import { VOICE_USER_LIMIT_MAX } from '@chatovo/schemas';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { FormField, Input } from '@/ui-kit';

import type { ChannelFieldsProps } from '../../ChannelForm.types';

export const ChannelVoiceFields = ({ form }: ChannelFieldsProps) => {
  const t = useTranslations('server.channels');

  const {
    control,
    formState: { errors }
  } = form;

  return (
    <FormField
      error={errors.userLimit?.message}
      hint={t('userLimitNone')}
      htmlFor='channel-user-limit'
      label={t('userLimitLabel')}
    >
      <Controller
        render={({ field }) => (
          <Input
            id='channel-user-limit'
            inputMode='numeric'
            max={VOICE_USER_LIMIT_MAX}
            min={1}
            placeholder={t('userLimitNone')}
            type='number'
            value={field.value ?? ''}
            onChange={(event) => {
              const raw = event.target.value;

              field.onChange(raw === '' ? null : Number(raw));
            }}
          />
        )}
        control={control}
        name='userLimit'
      />
    </FormField>
  );
};
