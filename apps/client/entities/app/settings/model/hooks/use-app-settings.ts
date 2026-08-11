'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { useMemo } from 'react';
import { mergeDeep } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';
import { readStoredJson } from '@/shared/lib';

import type { AppSettings, UseAppSettings } from '../types';

import { DEFAULT_APP_SETTINGS } from '../../config/config';

const withDefaults = (value: Partial<AppSettings> | null | undefined): AppSettings =>
  mergeDeep(DEFAULT_APP_SETTINGS, value ?? {}) as AppSettings;

const readSettings = (): AppSettings =>
  withDefaults(readStoredJson<Partial<AppSettings> | null>(STORAGE_KEYS.appSettings, null));

export const useAppSettings = (): UseAppSettings => {
  const { value, set } = useLocalStorage<AppSettings>(
    STORAGE_KEYS.appSettings,
    DEFAULT_APP_SETTINGS
  );

  const settings = useMemo(() => withDefaults(value), [value]);

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
