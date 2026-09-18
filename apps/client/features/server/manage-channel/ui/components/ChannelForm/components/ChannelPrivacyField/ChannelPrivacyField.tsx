'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { Label, Row, Stack, Switch, Text } from '@/ui-kit';

import type { ChannelFieldsProps } from '../../ChannelForm.types';

export const ChannelPrivacyField = ({ form }: ChannelFieldsProps) => {
  const t = useTranslations('server.channels');

  const { control } = form;

  return (
    <Stack gap='1'>
      <Row align='center' gap='3' justify='between'>
        <Label htmlFor='channel-private'>{t('privateLabel')}</Label>
        <Controller
          render={({ field }) => (
            <Switch
              checked={field.value ?? false}
              id='channel-private'
              onCheckedChange={field.onChange}
            />
          )}
          control={control}
          name='isPrivate'
        />
      </Row>
      <Text size='xs' tone='muted'>
        {t('privateHint')}
      </Text>
    </Stack>
  );
};
