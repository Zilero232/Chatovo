'use client';

import { SERVER_DESCRIPTION_MAX_LENGTH, SERVER_NAME_MAX_LENGTH } from '@chatovo/schemas';
import { useTranslations } from 'next-intl';

import { FormActions, FormField, Input, Stack, Textarea } from '@/ui-kit';

import type { CreateServerFormProps } from './CreateServerForm.types';

import { useCreateServerForm } from '../../../model/hooks';

export const CreateServerForm = ({ onBack, onCreated }: CreateServerFormProps) => {
  const t = useTranslations('server.create');
  const tCommon = useTranslations('common');

  const { form, isPending, canSubmit, onSubmit } = useCreateServerForm({ onCreated });

  const {
    formState: { errors },
    register
  } = form;

  return (
    <Stack as='form' gap='3' onSubmit={onSubmit}>
      <FormField error={errors.name?.message} htmlFor='create-server-name' label={t('nameLabel')}>
        <Input
          autoComplete='off'
          id='create-server-name'
          maxLength={SERVER_NAME_MAX_LENGTH}
          placeholder={t('namePlaceholder')}
          {...register('name')}
        />
      </FormField>

      <FormField
        error={errors.description?.message}
        htmlFor='create-server-description'
        label={t('descriptionLabel')}
      >
        <Textarea
          id='create-server-description'
          maxLength={SERVER_DESCRIPTION_MAX_LENGTH}
          placeholder={t('descriptionPlaceholder')}
          rows={3}
          {...register('description')}
        />
      </FormField>

      <FormActions
        cancelLabel={tCommon('back')}
        isDisabled={!canSubmit}
        isPending={isPending}
        submitLabel={t('submit')}
        onCancel={onBack}
      />
    </Stack>
  );
};
