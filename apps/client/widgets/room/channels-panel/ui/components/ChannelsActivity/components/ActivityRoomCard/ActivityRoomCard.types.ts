import type { ActivityRoomGroup } from '@/widgets/room/channels-panel/lib';

export type ActivityRoomCardProps = {
  group: ActivityRoomGroup;
  onNavigate?: () => void;
};
