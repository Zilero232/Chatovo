import type { ServerRailOrientation } from '../../ServerRail.types';

export type ServerRailHomeProps = {
  orientation: ServerRailOrientation;
  onNavigate?: () => void;
};
