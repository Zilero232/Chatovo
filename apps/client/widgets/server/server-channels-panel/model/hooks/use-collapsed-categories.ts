'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import { STORAGE_KEYS } from '@/shared/constants';

type CollapsedMap = Record<string, string[]>;

export const useCollapsedCategories = (serverId: string) => {
  const { value, set } = useLocalStorage<CollapsedMap>(STORAGE_KEYS.collapsedCategories, {});

  const collapsed = value?.[serverId] ?? [];

  const isCollapsed = (categoryId: string) => collapsed.includes(categoryId);

  const toggle = (categoryId: string) => {
    const next = isCollapsed(categoryId)
      ? collapsed.filter((id) => id !== categoryId)
      : [...collapsed, categoryId];

    set({ ...(value ?? {}), [serverId]: next });
  };

  return { isCollapsed, toggle };
};
