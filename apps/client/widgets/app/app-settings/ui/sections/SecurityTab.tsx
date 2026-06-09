'use client';

import { useTranslations } from 'next-intl';
import { ChangeEmailForm } from '@/features/auth/change-email';
import { ChangePasswordForm } from '@/features/auth/change-password';
import { Separator } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

export const SecurityTab = () => {
  const t = useTranslations('settings.security');

  return (
    <div className={s.profilePanel}>
      <section className={s.profileSection}>
        <h3 className={s.profileSectionTitle}>{t('emailTitle')}</h3>
        <ChangeEmailForm />
      </section>

      <Separator />

      <section className={s.profileSection}>
        <h3 className={s.profileSectionTitle}>{t('passwordTitle')}</h3>
        <ChangePasswordForm />
      </section>
    </div>
  );
};
