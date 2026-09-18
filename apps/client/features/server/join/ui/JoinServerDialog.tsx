'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Compass } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormActions,
  FormField,
  Input,
  Stack
} from '@/ui-kit';

import type { JoinServerDialogProps } from './JoinServerDialog.types';

import { useJoinServerForm } from '../model/hooks';

export const JoinServerDialog = ({ trigger }: JoinServerDialogProps) => {
  const t = useTranslations('server.join');
  const [isOpen, toggleOpen] = useBoolean(false);

  const { form, isPending, canSubmit, onSubmit } = useJoinServerForm({
    onJoined: () => toggleOpen(false)
  });

  const {
    formState: { errors },
    register
  } = form;

  return (
    <Dialog
      trigger={
        trigger ?? (
          <Button type='button' variant='outline'>
            <Compass />
            {t('title')}
          </Button>
        )
      }
      open={isOpen}
      onOpenChange={toggleOpen}
    >
      <DialogContent>
        <DialogHeader icon={<Compass />} tone='cyan'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Stack as='form' gap='3' onSubmit={onSubmit}>
          <FormField error={errors.code?.message} htmlFor='join-server-code' label={t('codeLabel')}>
            <Input
              autoComplete='off'
              id='join-server-code'
              placeholder={t('codePlaceholder')}
              {...register('code')}
            />
          </FormField>

          <FormActions
            isDisabled={!canSubmit}
            isPending={isPending}
            submitLabel={t('submit')}
            onCancel={() => toggleOpen(false)}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
