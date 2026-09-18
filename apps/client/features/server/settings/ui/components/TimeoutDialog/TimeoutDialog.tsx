'use client';

import { addMinutes } from 'date-fns';
import { TimerOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useToastError } from '@/entities/app/locale';
import { useUpdateMember } from '@/entities/server/member';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormActions,
  FormField,
  Select,
  Stack
} from '@/ui-kit';

import type { TimeoutDialogProps } from './TimeoutDialog.types';

const DURATIONS = ['0', '5', '10', '60', '1440', '10080'] as const;

const formatDuration = (value: string, off: string) => {
  const minutes = Number(value);

  if (minutes === 0) {
    return off;
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  return minutes < 1440 ? `${minutes / 60}h` : `${minutes / 1440}d`;
};

export const TimeoutDialog = ({ member, serverId, open, onOpenChange }: TimeoutDialogProps) => {
  const t = useTranslations('server.members');
  const toastError = useToastError();

  const updateMutation = useUpdateMember(serverId);

  const [duration, setDuration] = useState<string>('10');

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const minutes = Number(duration);
    const mutedUntil = minutes === 0 ? null : addMinutes(new Date(), minutes).toISOString();

    updateMutation.mutate(
      { userId: member.userId, input: { mutedUntil } },
      { onSuccess: () => onOpenChange(false), onError: toastError(`timeout-${member.id}`) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<TimerOff />} tone='violet'>
          <DialogTitle>{t('timeout')}</DialogTitle>
        </DialogHeader>

        <Stack as='form' gap='3' onSubmit={submit}>
          <FormField htmlFor='timeout-duration' label={t('timeoutDuration')}>
            <Select
              options={DURATIONS.map((value) => ({
                value,
                label: formatDuration(value, t('timeoutOff'))
              }))}
              aria-label={t('timeoutDuration')}
              value={duration}
              onChange={setDuration}
            />
          </FormField>

          <FormActions
            isPending={updateMutation.isPending}
            submitLabel={t('timeout')}
            onCancel={() => onOpenChange(false)}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
