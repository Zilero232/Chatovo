import type { Server } from '@chatovo/schemas';

import type { ServerRailOrientation } from '../../ServerRail.types';

export type ServerRailItemProps = {
  isActive: boolean;
  orientation: ServerRailOrientation;
  server: Server;
  onNavigate?: () => void;
};
