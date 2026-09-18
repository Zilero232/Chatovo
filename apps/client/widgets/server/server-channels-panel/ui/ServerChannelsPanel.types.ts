export type ServerChannelsPanelVariant = 'desktop' | 'drawer';

export type ServerChannelsPanelProps = {
  variant?: ServerChannelsPanelVariant;
  onNavigate?: () => void;
};
