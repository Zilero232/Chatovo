import { createPageMetadata } from '@/shared/seo';
import { RoomPage } from '@/views/room';

export const metadata = createPageMetadata({
  title: 'Voice room',
  description:
    'You are in a Chatovo voice and video room. Talk, share, and stay focused — no clutter, no noise.',
  path: '/room',
  index: false,
  follow: false,
});

export const generateStaticParams = () => {
  return [{ slug: [] }];
};

const Page = () => <RoomPage />;

export default Page;
