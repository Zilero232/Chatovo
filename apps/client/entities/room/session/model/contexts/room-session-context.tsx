'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useState } from 'react';

import type { RoomSession, RoomSessionValue } from './room-session-context.types';

const useRoomSessionValue = (): RoomSessionValue => {
  const [session, setSession] = useState<RoomSession | null>(null);

  const close = (roomId?: string) => {
    setSession((current) => {
      if (roomId && current?.roomId !== roomId) {
        return current;
      }

      return null;
    });
  };

  return { session, open: setSession, close };
};

const { Provider, use } = createContextHook(useRoomSessionValue);

export const RoomSessionProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useRoomSession = (): RoomSessionValue => {
  const value = use();

  if (!value) {
    throw new Error('useRoomSession must be used within RoomSessionProvider');
  }

  return value;
};
