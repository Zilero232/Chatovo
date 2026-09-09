import { getTranslations } from 'next-intl/server';

import { LEGAL } from '@/shared/config';

import type {
  GetLegalDocumentInput,
  LegalDocument,
  LegalSection
} from './get-legal-document.types';

const formatParagraph = (text: string) => text.replaceAll('{contact}', LEGAL.supportEmail);

export const getLegalDocument = async ({
  documentId,
  locale
}: GetLegalDocumentInput): Promise<LegalDocument> => {
  const t = await getTranslations({ locale, namespace: `legal.${documentId}` });
  const sections = t.raw('sections') as LegalSection[];

  return {
    title: t('title'),
    updated: t('updated'),
    sections: sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs.map(formatParagraph)
    }))
  };
};
