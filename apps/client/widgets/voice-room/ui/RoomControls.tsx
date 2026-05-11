import { ControlBar } from '@livekit/components-react';

export const RoomControls = () => (
  <ControlBar controls={{ chat: false, settings: false }} variation="minimal" />
);
