import type { ActivityRoomGroup } from '@/widgets/room/channels-panel/lib';

export type ActivityRoomsProps = {
  groups: ActivityRoomGroup[];
  onNavigate?: () => void;
};
