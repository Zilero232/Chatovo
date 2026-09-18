export type ServerRailOrientation = 'horizontal' | 'vertical';

export type ServerRailProps = {
  orientation?: ServerRailOrientation;
  onNavigate?: () => void;
};
