import { useTranslations } from 'next-intl';

import { LEGAL } from '@/shared/config';

type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type LegalDocumentId = 'privacyPage' | 'termsPage';

type LegalDocument = {
  title: string;
  updated: string;
  sections: LegalSection[];
};

const formatParagraph = (text: string) => text.replaceAll('{contact}', LEGAL.supportEmail);

export const useLegalDocument = (documentId: LegalDocumentId): LegalDocument => {
  const t = useTranslations(`legal.${documentId}`);
  const sections = t.raw('sections') as LegalSection[];

  return {
    title: t('title'),
    updated: t('updated'),
    sections: sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs.map(formatParagraph),
    })),
  };
};

export type { LegalDocumentId };
