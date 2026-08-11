'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { mergeDeep } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';

import type { AppSettings, UseAppSettings } from '../types';

import { DEFAULT_APP_SETTINGS } from '../../config/config';

export const useAppSettings = (): UseAppSettings => {
  const { value, set } = useLocalStorage<AppSettings>(
    STORAGE_KEYS.appSettings,
    DEFAULT_APP_SETTINGS
  );

  const settings: AppSettings = mergeDeep(DEFAULT_APP_SETTINGS, value ?? {});

  const readSettings = (): AppSettings => {
    if (typeof window === 'undefined') {
      return settings;
    }

    const raw = window.localStorage.getItem(STORAGE_KEYS.appSettings);

    if (!raw) {
      return settings;
    }

    try {
      return mergeDeep(DEFAULT_APP_SETTINGS, (JSON.parse(raw) as AppSettings) ?? {});
    } catch {
      return settings;
    }
  };

  const setGroup: UseAppSettings['setGroup'] = (group, patch) => {
    const current = readSettings();

    set({ ...current, [group]: { ...current[group], ...patch } });
  };

  const toggleSound: UseAppSettings['toggleSound'] = (category) => {
    const current = readSettings();

    setGroup('sounds', {
      enabled: { ...current.sounds.enabled, [category]: !current.sounds.enabled[category] }
    });
  };

  return { settings, setGroup, toggleSound };
};
