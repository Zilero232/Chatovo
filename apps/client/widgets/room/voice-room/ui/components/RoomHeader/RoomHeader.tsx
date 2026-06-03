'use client';

import { AudioLines } from 'lucide-react';
import { ConnectionIndicator } from '../ConnectionIndicator';
import { roomHeaderStyles as s } from './RoomHeader.styles';

type RoomHeaderProps = {
  name: string;
};

export const RoomHeader = ({ name }: RoomHeaderProps) => {
  return (
    <div className={s.root}>
      <span aria-hidden className={s.icon}>
        <AudioLines className="size-4" />
      </span>

      <div className={s.info}>
        <span className={s.title}>{name}</span>
      </div>

      <ConnectionIndicator />
    </div>
  );
};
