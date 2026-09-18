import { Hash, Megaphone, MessagesSquare, Volume2 } from 'lucide-react';
import { match } from 'ts-pattern';

import type { ChannelIconProps } from './ChannelIcon.types';

export const ChannelIcon = ({ type, className }: ChannelIconProps) =>
  match(type)
    .with('voice', () => <Volume2 aria-hidden className={className} />)
    .with('announcement', () => <Megaphone aria-hidden className={className} />)
    .with('forum', () => <MessagesSquare aria-hidden className={className} />)
    .otherwise(() => <Hash aria-hidden className={className} />);
