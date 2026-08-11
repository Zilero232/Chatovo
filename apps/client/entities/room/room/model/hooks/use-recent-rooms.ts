'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { isArray } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';

const MAX_RECENT = 6;

type RecentEntry = {
  id: string;
  visitedAt: number;
};

export const useRecentRooms = () => {
  const { value, set } = useLocalStorage<RecentEntry[]>(STORAGE_KEYS.recentRooms, []);

  const recent = value ?? [];

  const readRecent = (): RecentEntry[] => {
    if (typeof window === 'undefined') {
      return recent;
    }

    const raw = window.localStorage.getItem(STORAGE_KEYS.recentRooms);

    if (!raw) {
      return recent;
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      return isArray(parsed) ? (parsed as RecentEntry[]) : recent;
    } catch {
      return recent;
    }
  };

  const push = (id: string) => {
    const filtered = readRecent().filter((entry) => entry.id !== id);

    set([{ id, visitedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT));
  };

  const remove = (id: string) => {
    set(readRecent().filter((entry) => entry.id !== id));
  };

  return { recent, push, remove };
};
