import type { Locale } from '@/shared/i18n';

export type LegalDocumentId = 'privacyPage' | 'termsPage';

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  sections: LegalSection[];
  title: string;
  updated: string;
};

export type GetLegalDocumentInput = {
  documentId: LegalDocumentId;
  locale: Locale;
};
