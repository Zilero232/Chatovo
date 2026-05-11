'use client';

import { Box, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { type ReactNode, Suspense, useEffect } from 'react';

import { useAuthStore } from '@/entities/user';
import { ChannelsPanel } from '@/widgets/channels-panel';
import { ServerRail } from '@/widgets/server-rail';
import { SettingsModal } from '@/widgets/settings';

const AuthedLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const [channelsOpened, { toggle: toggleChannels }] = useDisclosure(true);
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);

  useEffect(() => {
    if (!session) router.replace('/auth');
  }, [session, router]);

  if (!session) return null;

  return (
    <Flex h="100vh" w="100vw" style={{ overflow: 'hidden' }}>
      <ServerRail
        channelsOpened={channelsOpened}
        onToggleChannels={toggleChannels}
        onOpenSettings={openSettings}
      />
      {channelsOpened ? (
        <Suspense fallback={null}>
          <ChannelsPanel onOpenSettings={openSettings} />
        </Suspense>
      ) : null}
      <Box flex={1} bg="dark.8" style={{ overflow: 'hidden' }}>
        {children}
      </Box>
      <SettingsModal opened={settingsOpened} onClose={closeSettings} />
    </Flex>
  );
};

export default AuthedLayout;
