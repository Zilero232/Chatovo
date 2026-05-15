import { Loader2 } from 'lucide-react';

import type { RoomConnectingProps } from './RoomConnecting.types';

import { roomConnectingStyles as s } from './RoomConnecting.styles';

export const RoomConnecting = ({ displayName }: RoomConnectingProps) => (
  <div className={s.root}>
    <div className={s.box}>
      <Loader2 className={s.icon} />
      <p className={s.text}>Connecting to "{displayName}"...</p>
    </div>
  </div>
);
