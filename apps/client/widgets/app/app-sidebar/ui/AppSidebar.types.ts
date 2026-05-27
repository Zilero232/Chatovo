export type AppSidebarOrientation = 'vertical' | 'horizontal';

export type AppSidebarProps = {
  channelsOpened: boolean;
  onToggleChannels: () => void;
  orientation?: AppSidebarOrientation;
  showToggleChannels?: boolean;
  /** Called when an action triggers navigation (used to close the mobile drawer). */
  onNavigate?: () => void;
};
