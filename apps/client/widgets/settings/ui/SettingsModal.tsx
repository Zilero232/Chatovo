'use client';

import {
  Button,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Tabs,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { LogOut, Palette, User } from 'lucide-react';

import { useCurrentUser } from '@/entities/user';
import { supabase } from '@/shared/api';

type Props = {
  opened: boolean;
  onClose: () => void;
};

export const SettingsModal = ({ opened, onClose }: Props) => {
  const { user, isAdmin } = useCurrentUser();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) notifications.show({ color: 'red', title: 'Error', message: error.message });
    else onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Settings" size="lg" centered>
      <Tabs defaultValue="account" orientation="vertical" placement="left">
        <Tabs.List>
          <Tabs.Tab value="account" leftSection={<User size={14} />}>
            Account
          </Tabs.Tab>
          <Tabs.Tab value="appearance" leftSection={<Palette size={14} />}>
            Appearance
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="account" pl="md">
          <Stack gap="md">
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase">
                Email
              </Text>
              <Text size="sm">{user?.email ?? '—'}</Text>
            </Stack>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase">
                Role
              </Text>
              <Text size="sm">{isAdmin ? 'admin' : 'user'}</Text>
            </Stack>
            <Text size="xs" c="dimmed">
              Audio/Video settings live in the pre-join screen before each room.
            </Text>
            <Group justify="flex-end" pt="md">
              <Button
                color="red"
                variant="light"
                leftSection={<LogOut size={14} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="appearance" pl="md">
          <Stack gap="md">
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase">
                Color scheme
              </Text>
              <SegmentedControl
                value={colorScheme}
                onChange={(value) => setColorScheme(value as 'light' | 'dark' | 'auto')}
                data={[
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' },
                  { label: 'Auto', value: 'auto' },
                ]}
              />
            </Stack>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};
