import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { LobbyPage } from '@/views/lobby';

export const metadata = createPageMetadata({
  title: 'Lobby',
  description:
    'Browse open voice and video rooms or create your own in seconds. Public, private, or password-protected — your call.',
  path: ROUTES.lobby,
  index: false,
  follow: false,
});

export const dynamic = 'force-static';

const Page = () => <LobbyPage />;

export default Page;
