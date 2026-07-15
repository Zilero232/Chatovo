'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match } from 'ts-pattern';

import { ForgotPasswordForm } from '@/features/auth/forgot-password';
import { SignInForm } from '@/features/auth/sign-in';
import { SignUpForm } from '@/features/auth/sign-up';
import { AuthBackground, LogoMark } from '@/shared/ui';
import { AuthBrandPanel, AuthLegalFooter } from './components';

import s from './AuthPage.module.scss';

import type { AuthMode } from './AuthPage.types';

export const AuthPage = () => {
  const t = useTranslations('auth');

  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <div className={clsx(s.root, 'inset-page-x', 'inset-page-y')}>
      <AuthBackground />

      <div className={clsx(s.shell, 'glass', 'shadow-glow-violet')}>
        <AuthBrandPanel />

        <div className={s.panel}>
          <span className={clsx(s.mobileMark, 'gradient-brand', 'shadow-glow-cyan')}>
            <LogoMark className={s.markIcon} size={30} />
          </span>

          <div className={s.header}>
            <h1 className={clsx(s.title, 'gradient-text')}>
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
          )}

          <AuthLegalFooter />
        </div>
      </div>
    </div>
  );
};
