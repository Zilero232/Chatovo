import { LEGAL } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { LegalDocumentPage } from '@/views/legal';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description: 'Chatovo privacy policy — how we collect, use, and protect your data.',
  path: ROUTES.privacy,
});

const Page = () => <LegalDocumentPage alternatePath={LEGAL.termsPath} documentId="privacyPage" />;

export default Page;
