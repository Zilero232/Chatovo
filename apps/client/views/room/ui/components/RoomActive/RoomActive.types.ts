import type { LocalUserChoices } from '@livekit/components-core';

export interface RoomActiveProps {
  choices: LocalUserChoices;
  displayName: string;
  token: string;
  url: string;
}
