'use client';

import { SERVER_DESCRIPTION_MAX_LENGTH, SERVER_NAME_MAX_LENGTH } from '@chatovo/schemas';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { useChannelTree } from '@/entities/server/channel';
import { FormField, Input, Select, Stack, SubmitButton, Textarea } from '@/ui-kit';

import type { OverviewTabProps } from './OverviewTab.types';

import { useServerSettingsForm } from '../../../model/hooks';
import { DangerZone } from '../DangerZone/DangerZone';
import { ServerIconField } from '../ServerIconField/ServerIconField';

const NO_CHANNEL = 'none';

export const OverviewTab = ({ server, onClose }: OverviewTabProps) => {
  const t = useTranslations('server.settings');

  const { tree } = useChannelTree(server.id);
  const { form, isPending, isDirty, onSubmit } = useServerSettingsForm({ server });

  const {
    control,
    formState: { errors },
    register
  } = form;

  const channelOptions = [
    { value: NO_CHANNEL, label: '—' },
    ...(tree?.channels ?? [])
      .filter((channel) => channel.type === 'text' || channel.type === 'announcement')
      .map((channel) => ({ value: channel.id, label: `# ${channel.name}` }))
  ];

  return (
    <Stack gap='4'>
      <ServerIconField server={server} />

      <Stack as='form' gap='3' onSubmit={onSubmit}>
        <FormField error={errors.name?.message} htmlFor='server-name' label={t('nameLabel')}>
          <Input id='server-name' maxLength={SERVER_NAME_MAX_LENGTH} {...register('name')} />
        </FormField>

        <FormField
          error={errors.description?.message}
          htmlFor='server-description'
          label={t('descriptionLabel')}
        >
          <Textarea
            id='server-description'
            maxLength={SERVER_DESCRIPTION_MAX_LENGTH}
            rows={3}
            {...register('description')}
          />
        </FormField>

        <FormField
          error={errors.systemChannelId?.message}
          htmlFor='server-system-channel'
          label={t('systemChannelLabel')}
        >
          <Controller
            render={({ field }) => (
              <Select
                aria-label={t('systemChannelLabel')}
                options={channelOptions}
                value={field.value ?? NO_CHANNEL}
                onChange={(next) => field.onChange(next === NO_CHANNEL ? null : next)}
              />
            )}
            control={control}
            name='systemChannelId'
          />
        </FormField>

        <SubmitButton disabled={!isDirty} isPending={isPending}>
          {t('save')}
        </SubmitButton>
      </Stack>

      <DangerZone server={server} onClose={onClose} />
    </Stack>
  );
};
