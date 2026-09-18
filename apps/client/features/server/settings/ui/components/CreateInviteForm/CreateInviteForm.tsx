'use client';

import { Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useToastError } from '@/entities/app/locale';
import { useCreateInvite } from '@/entities/server/invite';
import { Button, FormField, Row, Select, Spinner } from '@/ui-kit';

import type { CreateInviteFormProps } from './CreateInviteForm.types';

const EXPIRY_MINUTES = ['0', '30', '60', '360', '1440', '10080'] as const;
const MAX_USES = ['0', '1', '5', '10', '25', '50', '100'] as const;

const formatMinutes = (value: string, never: string) => {
  const minutes = Number(value);

  if (minutes === 0) {
    return never;
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  return minutes < 1440 ? `${minutes / 60}h` : `${minutes / 1440}d`;
};

export const CreateInviteForm = ({ serverId }: CreateInviteFormProps) => {
  const t = useTranslations('server.invites');
  const toastError = useToastError();

  const createMutation = useCreateInvite(serverId);

  const [expiry, setExpiry] = useState<string>('0');
  const [maxUses, setMaxUses] = useState<string>('0');

  const create = () => {
    createMutation.mutate(
      {
        expiresInMinutes: expiry === '0' ? undefined : Number(expiry),
        maxUses: maxUses === '0' ? undefined : Number(maxUses)
      },
      { onError: toastError(`invite-create-${serverId}`) }
    );
  };

  return (
    <Row wrap align='end' gap='2'>
      <FormField htmlFor='invite-expiry' label={t('expiresLabel')}>
        <Select
          options={EXPIRY_MINUTES.map((value) => ({
            value,
            label: formatMinutes(value, t('expiresNever'))
          }))}
          aria-label={t('expiresLabel')}
          value={expiry}
          onChange={setExpiry}
        />
      </FormField>

      <FormField htmlFor='invite-max-uses' label={t('maxUsesLabel')}>
        <Select
          options={MAX_USES.map((value) => ({
            value,
            label: value === '0' ? t('maxUsesNone') : value
          }))}
          aria-label={t('maxUsesLabel')}
          value={maxUses}
          onChange={setMaxUses}
        />
      </FormField>

      <Button disabled={createMutation.isPending} type='button' onClick={create}>
        {createMutation.isPending ? <Spinner decorative /> : <Link2 />}
        {t('create')}
      </Button>
    </Row>
  );
};
