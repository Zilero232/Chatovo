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
