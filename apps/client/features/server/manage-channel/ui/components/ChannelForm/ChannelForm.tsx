'use client';

import { useTranslations } from 'next-intl';

import { Button, DialogFooter, Spinner, Stack } from '@/ui-kit';

import type { ChannelFormProps } from './ChannelForm.types';

import { useChannelForm } from '../../../model/hooks';
import {
  ChannelBasicsFields,
  ChannelPrivacyField,
  ChannelTextFields,
  ChannelTypeField,
  ChannelVoiceFields
} from './components';

export const ChannelForm = ({ serverId, channel, categoryId, onDone }: ChannelFormProps) => {
  const t = useTranslations('server.channels');
  const tCommon = useTranslations('common');

  const { form, type, isEdit, isPending, canSubmit, onSubmit } = useChannelForm({
    serverId,
    channel,
    categoryId,
    onDone
  });

  return (
    <Stack as='form' gap='3' onSubmit={onSubmit}>
      {!isEdit && <ChannelTypeField form={form} />}

      <ChannelBasicsFields form={form} serverId={serverId} />

      {type === 'voice' ? <ChannelVoiceFields form={form} /> : <ChannelTextFields form={form} />}

      {!isEdit && <ChannelPrivacyField form={form} />}

      <DialogFooter>
        <Button disabled={isPending} type='button' variant='outline' onClick={onDone}>
          {tCommon('cancel')}
        </Button>
        <Button disabled={!canSubmit} type='submit' variant='primary'>
          {isPending && <Spinner decorative />}
          {isEdit ? t('editChannel') : t('createChannel')}
        </Button>
      </DialogFooter>
    </Stack>
  );
};
