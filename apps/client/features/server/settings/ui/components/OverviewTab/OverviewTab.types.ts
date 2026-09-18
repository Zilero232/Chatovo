import type { Server } from '@chatovo/schemas';

export type OverviewTabProps = {
  server: Server;
  onClose: () => void;
};
