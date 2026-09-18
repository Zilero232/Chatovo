import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { DmPage } from '@/views/app/dm';

export const metadata = createPageMetadata({
  title: 'Direct messages',
  description: 'A private conversation with a friend on Chatovo.',
  path: ROUTES.dm,
  index: false,
  follow: false
});

const Page = () => <DmPage />;

export default Page;
