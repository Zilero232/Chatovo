import type { ReactNode } from 'react';

export type LobbyStatTone = 'live' | 'online' | 'rooms';

export type LobbyStatProps = {
  icon: ReactNode;
  isActive?: boolean;
  isLoading?: boolean;
  label: string;
  tone: LobbyStatTone;
  value: number;
};
