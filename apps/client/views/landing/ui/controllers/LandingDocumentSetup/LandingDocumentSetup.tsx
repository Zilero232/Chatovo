'use client';

import { useEffect } from 'react';

import { LANDING_HTML_LANG } from '../../../config';

import type { LandingDocumentSetupProps } from './LandingDocumentSetup.types';

const LANDING_CLASS = 'landing';

export const LandingDocumentSetup = ({ locale }: LandingDocumentSetupProps) => {
  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;

    root.classList.add(LANDING_CLASS);
    root.lang = LANDING_HTML_LANG[locale];

    return () => {
      root.classList.remove(LANDING_CLASS);
      root.lang = previousLang;
    };
  }, [locale]);

  return null;
};
