'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useState } from 'react';

const useMiniRoomSlotState = () => {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  return { slot, setSlot };
};

const { Provider, use } = createContextHook(useMiniRoomSlotState);

export const MiniRoomSlotProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useMiniRoomSlot = () => {
  const value = use();

  if (!value) {
    throw new Error('useMiniRoomSlot must be used within MiniRoomSlotProvider');
  }

  return value;
};
