'use client';

import { Loader2, MailWarning } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { useCurrentUser, useSendVerificationEmail } from '@/entities/auth/user';
import { Button, Text } from '@/shared/ui';

import s from './EmailVerificationNotice.module.scss';

export const EmailVerificationNotice = () => {
  const t = useTranslations('settings.security');
  const errorMessage = useErrorMessage();
  const { emailVerified, user } = useCurrentUser();
  const { isPending, mutate } = useSendVerificationEmail();
  const [sent, setSent] = useState(false);

  if (!user || emailVerified) {
    return null;
  }

  const send = () => {
    mutate(user.email, {
      onSuccess: () => {
        setSent(true);
        toast.success(t('emailVerificationSent'));
      },
      onError: (err: Error) => {
        toast.error(errorMessage(err));
      },
    });
  };

  return (
    <div className={s.root} role="status">
      <div className={s.header}>
        <MailWarning className={s.icon} />
        <div className={s.copy}>
          <Text size="sm" weight="medium">
            {t('emailNotVerifiedTitle')}
          </Text>
          <Text className={s.description} size="xs" tone="muted">
            {t('emailNotVerifiedDescription', { email: user.email })}
          </Text>
        </div>
      </div>

      <div className={s.actions}>
        <Button disabled={isPending} size="sm" type="button" variant="secondary" onClick={send}>
          {isPending && <Loader2 className={s.spinner} />}
          {sent ? t('emailVerificationResend') : t('emailVerificationSend')}
        </Button>
        {sent && <span className={s.sent}>{t('emailVerificationSentHint')}</span>}
      </div>
    </div>
  );
};
