import type { Locale } from '@/shared/i18n';

import type { LegalDocumentId } from '../model';

export type LegalDocumentPageProps = {
  alternatePath: string;
  documentId: LegalDocumentId;
  locale: Locale;
};
