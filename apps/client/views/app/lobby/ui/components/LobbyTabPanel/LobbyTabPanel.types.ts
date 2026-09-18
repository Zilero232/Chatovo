import type { LobbyTab } from '../../LobbyPage.types';

export type LobbyTabPanelProps = {
  tab: Exclude<LobbyTab, 'add' | 'servers'>;
};
