'use client';

import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LEGAL } from '@/shared/config';
import { EXTERNAL_LINKS, ROUTES } from '@/shared/constants';
import { type LegalDocumentId, useLegalDocument } from '../model';

import s from './LegalDocumentPage.module.scss';

type LegalDocumentPageProps = {
  documentId: LegalDocumentId;
  alternatePath: string;
};

export const LegalDocumentPage = ({ documentId, alternatePath }: LegalDocumentPageProps) => {
  const t = useTranslations('legal');
  const content = useLegalDocument(documentId);

  const alternateLabel = alternatePath === LEGAL.termsPath ? t('terms') : t('privacy');

  return (
    <main className={clsx(s.root, 'inset-page-x', 'inset-page-y')}>
      <article className={clsx(s.shell, 'glass', 'shadow-glow-violet')}>
        <div className={s.top}>
          <Link className={s.backLink} href={ROUTES.auth}>
            <ArrowLeft aria-hidden className={s.backIcon} />
            {t('back')}
          </Link>

          <header className={s.header}>
            <h1 className={clsx(s.title, 'gradient-text')}>{content.title}</h1>
            <p className={s.updated}>{content.updated}</p>
          </header>
        </div>

        <div className={clsx(s.scroll, 'scrollbar-none')}>
          <div className={s.sections}>
            {content.sections.map((section) => (
              <section key={section.heading} className={s.section}>
                <h2 className={s.heading}>{section.heading}</h2>
                <div className={s.body}>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className={s.paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <footer className={s.footer}>
            <a className={s.footerLink} href={EXTERNAL_LINKS.supportEmail}>
              {LEGAL.supportEmail}
            </a>
            <span aria-hidden className={s.footerSep}>
              ·
            </span>
            <Link className={s.footerLink} href={alternatePath}>
              {alternateLabel}
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
};
