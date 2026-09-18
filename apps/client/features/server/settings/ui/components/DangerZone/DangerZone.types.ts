import type { Server } from '@chatovo/schemas';

export type DangerZoneProps = {
  server: Server;
  onClose: () => void;
};
