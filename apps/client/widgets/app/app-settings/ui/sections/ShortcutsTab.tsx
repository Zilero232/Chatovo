'use client';

import { SHORTCUT_ACTIONS } from '@/entities/app/shortcut';
import { isTauriDesktop } from '@/shared/lib';
import s from '../AppSettingsButton.module.scss';
import { ShortcutActionRow } from '../components/ShortcutActionRow';
import { WebNotice } from '../components/WebNotice';

export const ShortcutsTab = () => {
  if (!isTauriDesktop()) {
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
