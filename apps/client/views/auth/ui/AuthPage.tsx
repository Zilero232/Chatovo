'use client';

import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match } from 'ts-pattern';
import { ForgotPasswordForm } from '@/features/auth/forgot-password';
import { GoogleAuthButton } from '@/features/auth/google';
import { SignInForm } from '@/features/auth/sign-in';
import { SignUpForm } from '@/features/auth/sign-up';
import { AuthBackground } from '@/shared/ui';
import { authPageStyles as s } from './AuthPage.styles';
import { AuthBrandPanel } from './components';

type AuthMode = 'signin' | 'signup' | 'forgot';

export const AuthPage = () => {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <div className={s.root}>
      <AuthBackground />

      <div className={s.shell}>
        <AuthBrandPanel />

        <div className={s.panel}>
          <span className={s.mobileMark}>
            <Sparkles className="size-6" />
          </span>

          <div className={s.header}>
            <h1 className={s.title}>
              {match(mode)
                .with('signup', () => t('signUp'))
                .with('forgot', () => t('forgotPasswordTitle'))
                .otherwise(() => t('signIn'))}
            </h1>
            <p className={s.subtitle}>
              {match(mode)
                .with('signup', () => t('subtitleSignUp'))
                .with('forgot', () => t('forgotPasswordSubtitle'))
                .otherwise(() => t('subtitleSignIn'))}
            </p>
          </div>

          <div key={mode} className={s.form}>
            {match(mode)
              .with('signup', () => <SignUpForm />)
              .with('forgot', () => <ForgotPasswordForm onBack={() => setMode('signin')} />)
              .otherwise(() => (
                <SignInForm onForgotPassword={() => setMode('forgot')} />
              ))}
          </div>

          {mode !== 'forgot' && (
            <>
              <div className={s.divider}>
                <span className={s.dividerLine} />
                <span className={s.dividerText}>{tCommon('or')}</span>
                <span className={s.dividerLine} />
              </div>

              <GoogleAuthButton />

              <p className={s.toggle}>
                {t(mode === 'signup' ? 'hasAccount' : 'noAccount')}{' '}
                <button
                  className={s.toggleButton}
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                >
                  {t(mode === 'signup' ? 'signIn' : 'signUp')}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
