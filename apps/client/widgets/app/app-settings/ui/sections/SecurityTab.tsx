'use client';

import { useTranslations } from 'next-intl';
import { Separator } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { ChangeEmailForm } from './ChangeEmailForm';
import { ChangePasswordForm } from './ChangePasswordForm';

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
