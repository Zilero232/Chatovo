export type ChannelsPanelVariant = 'desktop' | 'drawer';

export type ChannelsPanelProps = {
  variant?: ChannelsPanelVariant;
  /** Called after the user navigates from within the panel (used to close the mobile drawer). */
  onNavigate?: () => void;
};
