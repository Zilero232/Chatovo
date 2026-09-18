import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { InvitePage } from '@/views/app/invite';

export const metadata = createPageMetadata({
  title: 'Invite',
  description: 'Join a Chatovo server with an invite link.',
  path: ROUTES.invite,
  index: false,
  follow: false
});

const Page = () => <InvitePage />;

export default Page;
