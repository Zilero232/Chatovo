'use client';

import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { secondsToMilliseconds } from 'date-fns';

import { useAppSettings } from '@/entities/app/settings';
import { QUERY_KEYS } from '@/shared/constants';
import { isTauriDesktop } from '@/shared/lib';

const POLL_INTERVAL_MS = secondsToMilliseconds(10);

const detectRunningGame = async (): Promise<string | null> => {
  try {
    return await invoke<string | null>('detect_running_game');
  } catch {
    return null;
  }
};

export const useGameActivity = (): string | null => {
  const { settings } = useAppSettings();

  const isEnabled = settings.system.shareActivity && isTauriDesktop();

  const { data } = useQuery({
    queryKey: QUERY_KEYS.runningGame(),
    queryFn: detectRunningGame,
    enabled: isEnabled,
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnWindowFocus: false,
    staleTime: POLL_INTERVAL_MS,
    gcTime: 0
  });

  if (!isEnabled) {
    return null;
  }

  return data ?? null;
};
