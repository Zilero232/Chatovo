import { createFileRoute } from '@tanstack/react-router';
import { LobbyPage } from '@/pages/lobby';

export const Route = createFileRoute('/_authed/lobby')({
  component: LobbyPage,
});
