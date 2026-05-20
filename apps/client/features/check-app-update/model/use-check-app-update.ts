'use client';

import { isTauri } from '@tauri-apps/api/core';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useEffect } from 'react';

export const useCheckAppUpdate = () => {
  useEffect(() => {
    if (!isTauri()) return;

    const run = async () => {
      try {
        const update = await check();

        if (!update) return;

        await update.downloadAndInstall();
        await relaunch();
      } catch (err) {
        console.error('Update check failed', err);
      }
    };

    run();
  }, []);
};
