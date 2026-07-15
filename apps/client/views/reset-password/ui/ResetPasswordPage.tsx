'use client';

import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';
import { CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ResetPasswordForm } from '@/features/auth/reset-password';
import { DEEP_LINKS, ROUTES } from '@/shared/constants';
import { AuthBackground, Button, LogoMark } from '@/shared/ui';

import s from './ResetPasswordPage.module.scss';

export const ResetPasswordPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations('auth');

  const token = params.get('token');
  const invalid = !token || params.has('error');

  const [done, setDone] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect once on mount when the link is invalid
  useEffect(() => {
    if (invalid) {
      toast.error(t('resetTokenMissing'), { id: 'reset-token-invalid' });

      router.replace(ROUTES.auth);
    }
  }, []);

  if (invalid) {
    return null;
  }

  return (
    <div className={clsx(s.root, 'inset-page-x', 'inset-page-y')}>
      <AuthBackground />

      <div className={clsx(s.shell, 'glass', 'shadow-glow-violet')}>
        <div className={s.panel}>
          <span className={clsx(s.mark, 'gradient-brand', 'shadow-glow-cyan')}>
            {done ? (
              <CheckCircle2 className={s.markIcon} />
            ) : (
              <LogoMark className={s.markIcon} size={30} />
            )}
          </span>

          <div className={s.header}>
            <h1 className={clsx(s.title, 'gradient-text')}>
              {done ? t('resetDoneTitle') : t('resetPasswordTitle')}
            </h1>
            <p className={s.subtitle}>
              {done ? t('resetDoneSubtitle') : t('resetPasswordSubtitle')}
            </p>
          </div>

          {done ? (
            <div className={s.actions}>
              {isTauri() ? (
                <Button
                  className={s.fullWidth}
                  type="button"
                  onClick={() => router.replace(ROUTES.auth)}
                >
                  {t('signInInBrowser')}
                </Button>
              ) : (
                <>
                  <Button className={s.fullWidth} href={ROUTES.auth}>
                    {t('signInInBrowser')}
                  </Button>

                  <a className={s.secondaryLink} href={DEEP_LINKS.auth}>
                    {t('openInApp')}
                  </a>
                </>
              )}
            </div>
          ) : (
            <div className={s.form}>
              <ResetPasswordForm token={token} onSuccess={() => setDone(true)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
