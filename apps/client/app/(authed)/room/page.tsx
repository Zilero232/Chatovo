import { ROUTES } from '@/shared/constants';
import { createPageMetadata } from '@/shared/seo';
import { RoomPage } from '@/views/app/room';

export const metadata = createPageMetadata({
  title: 'Voice room',
  description:
    'You are in a Chatovo voice and video room. Talk, share, and stay focused — no clutter, no noise.',
  path: ROUTES.room,
  index: false,
  follow: false
});

const Page = () => <RoomPage />;

export default Page;
