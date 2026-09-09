import { invoke } from '@tauri-apps/api/core';

/** Returns `null` when no game is running, or when the desktop command is unavailable. */
export const detectRunningGame = async (): Promise<string | null> => {
  try {
    return await invoke<string | null>('detect_running_game');
  } catch {
    return null;
  }
};
