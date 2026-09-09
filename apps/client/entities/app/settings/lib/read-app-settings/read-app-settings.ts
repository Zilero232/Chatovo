import { mergeDeep } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';
import { readStoredJson } from '@/shared/lib';

import type { AppSettings } from '../../model/types';

import { DEFAULT_APP_SETTINGS } from '../../config/config';

/** Fills every missing branch from the defaults, so a partial stored object stays usable. */
export const withAppSettingsDefaults = (
  value: Partial<AppSettings> | null | undefined
): AppSettings => mergeDeep(DEFAULT_APP_SETTINGS, value ?? {}) as AppSettings;

/** Reads the settings straight off localStorage, bypassing React state. */
export const readAppSettings = (): AppSettings =>
  withAppSettingsDefaults(
    readStoredJson<Partial<AppSettings> | null>(STORAGE_KEYS.appSettings, null)
  );
