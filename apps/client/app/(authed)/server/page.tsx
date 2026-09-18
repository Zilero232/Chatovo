import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { ServerPage } from '@/views/app/server';

export const metadata = createPageMetadata({
  title: 'Server',
  description: 'Text and voice channels of a Chatovo server.',
  path: ROUTES.server,
  index: false,
  follow: false
});

const Page = () => <ServerPage />;

export default Page;
