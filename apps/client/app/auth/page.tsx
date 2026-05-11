'use client';

import { Center, Paper, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/entities/user';
import { AuthByEmailForm } from '@/features/auth-by-email';

const AuthRoute = () => {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (session) router.replace('/lobby');
  }, [session, router]);

  return (
    <Center h="100vh" p="md">
      <Paper withBorder shadow="md" p="xl" radius="md" w="100%" maw={400}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={2}>Solvex</Title>
            <Text c="dimmed" size="sm">
              Sign in to join voice rooms
            </Text>
          </Stack>
          <AuthByEmailForm />
        </Stack>
      </Paper>
    </Center>
  );
};

export default AuthRoute;
