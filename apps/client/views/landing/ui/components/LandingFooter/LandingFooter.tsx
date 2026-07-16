import { clsx } from 'clsx';
import Link from 'next/link';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Text } from '@/shared/ui';

import s from '../../LandingPage.module.scss';

import type { LandingContentProps } from '../../LandingPage.types';

export const LandingFooter = ({ content }: LandingContentProps) => (
  <footer className={clsx(s.container, s.footer)}>
    <Text size="sm" tone="muted">
      © {SITE.name}
    </Text>

    <nav className={s.footerLinks}>
      <Link className={s.footerLink} href={ROUTES.privacy}>
        {content.footer.privacy}
      </Link>
      <Link className={s.footerLink} href={ROUTES.terms}>
        {content.footer.terms}
      </Link>
    </nav>
  </footer>
);
