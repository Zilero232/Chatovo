'use client';

import { CHANNEL_NAME_MAX_LENGTH } from '@chatovo/schemas';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { useChannelTree } from '@/entities/server/channel';
import { FormField, Input, Select } from '@/ui-kit';

import type { ChannelBasicsFieldsProps } from './ChannelBasicsFields.types';

const NO_CATEGORY = 'none';

export const ChannelBasicsFields = ({ form, serverId }: ChannelBasicsFieldsProps) => {
  const t = useTranslations('server.channels');

  const { tree } = useChannelTree(serverId);

  const {
    control,
    formState: { errors },
    register
  } = form;

  const categoryOptions = [
    { value: NO_CATEGORY, label: t('noCategory') },
    ...(tree?.categories ?? []).map((category) => ({ value: category.id, label: category.name }))
  ];

  return (
    <>
      <FormField error={errors.name?.message} htmlFor='channel-name' label={t('nameLabel')}>
        <Input
          autoComplete='off'
          id='channel-name'
          maxLength={CHANNEL_NAME_MAX_LENGTH}
          placeholder={t('namePlaceholder')}
          {...register('name')}
        />
      </FormField>

      <FormField
        error={errors.categoryId?.message}
        htmlFor='channel-category'
        label={t('categoryLabel')}
      >
        <Controller
          render={({ field }) => (
            <Select
              aria-label={t('categoryLabel')}
              options={categoryOptions}
              value={field.value ?? NO_CATEGORY}
              onChange={(next) => field.onChange(next === NO_CATEGORY ? null : next)}
            />
          )}
          control={control}
          name='categoryId'
        />
      </FormField>
    </>
  );
};
