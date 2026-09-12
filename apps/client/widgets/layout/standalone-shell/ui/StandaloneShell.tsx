'use client';

import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { BrandMark, Text } from '@/ui-kit';
import { LanguageSwitcher } from '@/widgets/app/language-switcher';

import type { StandaloneShellProps } from './StandaloneShell.types';

import s from './StandaloneShell.module.scss';

export const StandaloneShell = ({ children, backHref, backLabel }: StandaloneShellProps) => (
  <div className={clsx(s.root, 'inset-page-x')}>
    <header className={s.header}>
      <Link className={s.brand} href={ROUTES.home}>
        <BrandMark glow size={28} />
        <Text as='span' className={clsx(s.brandName, 'gradient-text')} tone='inherit'>
          {SITE.name}
        </Text>
      </Link>

      <div className={s.actions}>
        {backHref && backLabel && (
          <Link className={s.action} href={backHref}>
            <ArrowLeft aria-hidden className={s.actionIcon} />
            {backLabel}
          </Link>
        )}

        <LanguageSwitcher />
      </div>
    </header>

    <main className={s.body}>{children}</main>
  </div>
);
