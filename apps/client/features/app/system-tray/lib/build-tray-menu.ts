import { CheckMenuItem, Menu, MenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu';
import { exit } from '@tauri-apps/plugin-process';

import { appEvents, showMainWindow } from '@/shared/lib';

import { TRAY_MENU_ID } from '../config/menu-ids';

type TrayMenuLabels = {
  checkUpdates: string;
  header: string;
  mute: string;
  quit: string;
};

export const buildTrayMenu = async (labels: TrayMenuLabels) => {
  const headerItem = MenuItem.new({
    id: TRAY_MENU_ID.header,
    text: labels.header,
    enabled: false
  });

  const muteItem = CheckMenuItem.new({
    id: TRAY_MENU_ID.mute,
    text: labels.mute,
    checked: false,
    enabled: true,
    action: () => {
      appEvents.emit.trayMuteToggle();
    }
  });

  const checkUpdatesItem = MenuItem.new({
    id: TRAY_MENU_ID.checkUpdates,
    text: labels.checkUpdates,
    action: async () => {
      appEvents.emit.recheckUpdate();

      try {
        await showMainWindow();
      } catch {}
    }
  });

  const quitItem = MenuItem.new({
    id: TRAY_MENU_ID.quit,
    text: labels.quit,
    action: async () => {
      try {
        await exit(0);
      } catch {}
    }
  });

  const separator = () => PredefinedMenuItem.new({ item: 'Separator' });

  const [header, mute, checkUpdates, quit, firstDivider, secondDivider, thirdDivider] =
    await Promise.all([
      headerItem,
      muteItem,
      checkUpdatesItem,
      quitItem,
      separator(),
      separator(),
      separator()
    ]);

  const items = { header, mute, checkUpdates, quit } as const;

  const menu = await Menu.new({
    items: [header, firstDivider, mute, secondDivider, checkUpdates, thirdDivider, quit]
  });

  return { menu, items };
};

export type TrayItems = Awaited<ReturnType<typeof buildTrayMenu>>['items'];
