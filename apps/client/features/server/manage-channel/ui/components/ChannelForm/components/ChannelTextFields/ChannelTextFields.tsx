'use client';

import { CHANNEL_TOPIC_MAX_LENGTH } from '@chatovo/schemas';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { FormField, Label, Row, Select, Switch, Textarea } from '@/ui-kit';

import type { ChannelFieldsProps } from '../../ChannelForm.types';

const SLOW_MODE_STEPS = [0, 5, 10, 30, 60, 300, 900, 3600] as const;

const formatSlowMode = (seconds: number, off: string) => {
  if (seconds === 0) {
    return off;
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  return seconds < 3600 ? `${seconds / 60}m` : `${seconds / 3600}h`;
};

export const ChannelTextFields = ({ form }: ChannelFieldsProps) => {
  const t = useTranslations('server.channels');

  const {
    control,
    formState: { errors },
    register
  } = form;

  const slowModeOptions = SLOW_MODE_STEPS.map((seconds) => ({
    value: String(seconds),
    label: formatSlowMode(seconds, t('slowModeOff'))
  }));

  return (
    <>
      <FormField error={errors.topic?.message} htmlFor='channel-topic' label={t('topicLabel')}>
        <Textarea
          id='channel-topic'
          maxLength={CHANNEL_TOPIC_MAX_LENGTH}
          placeholder={t('topicPlaceholder')}
          rows={2}
          {...register('topic')}
        />
      </FormField>

      <FormField
        error={errors.slowMode?.message}
        htmlFor='channel-slow-mode'
        label={t('slowModeLabel')}
      >
        <Controller
          render={({ field }) => (
            <Select
              aria-label={t('slowModeLabel')}
              options={slowModeOptions}
              value={String(field.value ?? 0)}
              onChange={(next) => field.onChange(Number(next))}
            />
          )}
          control={control}
          name='slowMode'
        />
      </FormField>

      <Row align='center' gap='3' justify='between'>
        <Label htmlFor='channel-nsfw'>{t('nsfwLabel')}</Label>
        <Controller
          render={({ field }) => (
            <Switch
              checked={field.value ?? false}
              id='channel-nsfw'
              onCheckedChange={field.onChange}
            />
          )}
          control={control}
          name='nsfw'
        />
      </Row>
    </>
  );
};
