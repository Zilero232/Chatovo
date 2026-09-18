'use client';

import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

import { useLastChannel } from '@/entities/server/channel';
import { buildServerHref, getAvatarColor, getInitials } from '@/shared/lib';
import { Tooltip, TooltipContent } from '@/ui-kit';

import type { ServerRailItemProps } from './ServerRailItem.types';

import { useServerUnread } from '../../../model/hooks';

import s from './ServerRailItem.module.scss';

export const ServerRailItem = ({
  server,
  isActive,
  orientation,
  onNavigate
}: ServerRailItemProps) => {
  const router = useRouter();

  const { lastChannelId } = useLastChannel(server.id);
  const hasUnread = useServerUnread(server.id);

  const open = () => {
    router.push(
      buildServerHref(server.id, {
        channelId: lastChannelId ?? server.systemChannelId ?? undefined
      })
    );
    onNavigate?.();
  };

  return (
    <Tooltip>
      <button
        style={
          server.iconUrl
            ? undefined
            : { background: server.bannerColor ?? getAvatarColor(server.name) }
        }
        aria-current={isActive ? 'page' : undefined}
        aria-label={server.name}
        className={clsx(s.root, { [s.active]: isActive, [s.unread]: hasUnread })}
        type='button'
        onClick={open}
      >
        <span aria-hidden className={s.pill} />
        {server.iconUrl ? (
          <img alt='' className={s.icon} src={server.iconUrl} />
        ) : (
          <span className={s.initials}>{getInitials(server.name)}</span>
        )}
      </button>
      <TooltipContent side={orientation === 'vertical' ? 'right' : 'top'}>
        {server.name}
      </TooltipContent>
    </Tooltip>
  );
};
