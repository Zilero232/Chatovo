'use client';

import { CheckCircle2, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ResetPasswordForm } from '@/features/auth/reset-password';
import { DEEP_LINKS, ROUTES } from '@/shared/constants';
import { AuthBackground, Button } from '@/shared/ui';
import { resetPasswordPageStyles as s } from './ResetPasswordPage.styles';

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
    <div className={s.root}>
      <AuthBackground />

      <div className={s.shell}>
        <div className={s.panel}>
          <span className={s.mark}>
            {done ? <CheckCircle2 className="size-6" /> : <Sparkles className="size-6" />}
          </span>

          <div className={s.header}>
            <h1 className={s.title}>{done ? t('resetDoneTitle') : t('resetPasswordTitle')}</h1>
            <p className={s.subtitle}>
              {done ? t('resetDoneSubtitle') : t('resetPasswordSubtitle')}
            </p>
          </div>

          {done ? (
            <div className={s.actions}>
              <Button asChild className="w-full">
                <a href={DEEP_LINKS.auth}>{t('openInApp')}</a>
              </Button>

              <button
                className={s.backButton}
                type="button"
                onClick={() => router.replace(ROUTES.auth)}
              >
                {t('signInInBrowser')}
              </button>
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
