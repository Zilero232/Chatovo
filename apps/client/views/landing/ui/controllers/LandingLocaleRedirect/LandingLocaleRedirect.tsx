'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES, STORAGE_KEYS } from '@/shared/constants';

import type { LandingLocaleRedirectProps } from './LandingLocaleRedirect.types';

const prefersRussian = () =>
  navigator.languages.some((language) => language.toLowerCase().startsWith('ru'));

export const LandingLocaleRedirect = ({ locale }: LandingLocaleRedirectProps) => {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEYS.landingLocaleRedirected)) {
      return;
    }

    sessionStorage.setItem(STORAGE_KEYS.landingLocaleRedirected, '1');

    const target = prefersRussian() ? ROUTES.landing : ROUTES.landingEn;
    const current = locale === 'ru' ? ROUTES.landing : ROUTES.landingEn;

    if (target !== current) {
      router.replace(target);
    }
  }, [locale, router]);

  return null;
};
