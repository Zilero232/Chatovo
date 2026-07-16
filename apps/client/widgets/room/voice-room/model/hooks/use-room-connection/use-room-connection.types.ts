import type { VoiceRoomProps } from '../../../ui/VoiceRoom.types';

export type UseRoomConnectionInput = Pick<
  VoiceRoomProps,
  'roomId' | 'onConnectFailure' | 'onLeave'
>;
