import { LEGAL } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { LegalDocumentPage } from '@/views/legal';

export const metadata = createPageMetadata({
  title: 'Terms of Service',
  description: 'Chatovo terms of service — rules for using voice rooms, chat, and accounts.',
  path: ROUTES.terms,
});

const Page = () => <LegalDocumentPage alternatePath={LEGAL.privacyPath} documentId="termsPage" />;

export default Page;
