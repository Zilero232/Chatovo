'use client';

import { isTauri } from '@tauri-apps/api/core';
import { SHORTCUT_ACTIONS } from '@/entities/app/shortcut';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { ShortcutActionRow } from '../components/ShortcutActionRow';
import { WebNotice } from '../components/WebNotice';

export const ShortcutsTab = () => {
  if (!isTauri()) {
    return (
      <div className={s.tabPanel}>
        <WebNotice />
      </div>
    );
  }

  return (
    <div className={s.tabPanel}>
      {Object.values(SHORTCUT_ACTIONS).map((actionId) => (
        <ShortcutActionRow key={actionId} actionId={actionId} />
      ))}
    </div>
  );
};
