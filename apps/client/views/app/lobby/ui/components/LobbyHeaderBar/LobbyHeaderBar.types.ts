import type { LobbyTab } from '../../LobbyPage.types';

export type LobbyHeaderBarProps = {
  tab: LobbyTab;
  onTabChange: (tab: LobbyTab) => void;
};
