'use client';

import { SERVER_NICKNAME_MAX_LENGTH } from '@chatovo/schemas';
import { Pencil } from 'lucide-react';
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
  Input,
  Stack
} from '@/ui-kit';

import type { NicknameDialogProps } from './NicknameDialog.types';

export const NicknameDialog = ({ member, serverId, open, onOpenChange }: NicknameDialogProps) => {
  const t = useTranslations('server.members');
  const toastError = useToastError();

  const updateMutation = useUpdateMember(serverId);

  const [nickname, setNickname] = useState(member.nickname ?? '');

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    updateMutation.mutate(
      { userId: member.userId, input: { nickname: nickname.trim() || null } },
      { onSuccess: () => onOpenChange(false), onError: toastError(`member-nickname-${member.id}`) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<Pencil />} tone='violet'>
          <DialogTitle>{t('changeNickname')}</DialogTitle>
        </DialogHeader>

        <Stack as='form' gap='3' onSubmit={submit}>
          <FormField htmlFor='member-nickname' label={t('changeNickname')}>
            <Input
              autoComplete='off'
              id='member-nickname'
              maxLength={SERVER_NICKNAME_MAX_LENGTH}
              placeholder={member.displayName}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
            />
          </FormField>

          <FormActions
            isPending={updateMutation.isPending}
            submitLabel={t('changeNickname')}
            onCancel={() => onOpenChange(false)}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
