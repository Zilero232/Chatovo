'use client';

import { clsx } from 'clsx';
import { useSearchParams } from 'next/navigation';

import { useServers } from '@/entities/server/server';
import { ScrollArea } from '@/ui-kit';

import type { ServerRailProps } from './ServerRail.types';

import { ServerRailActions, ServerRailHome, ServerRailItem } from './components';

import s from './ServerRail.module.scss';

export const ServerRail = ({ orientation = 'vertical', onNavigate }: ServerRailProps) => {
  const params = useSearchParams();

  const { servers } = useServers();

  const activeServerId = params.get('id');
  const isVertical = orientation === 'vertical';

  return (
    <nav
      className={clsx(s.root, isVertical ? s.vertical : s.horizontal)}
      data-orientation={orientation}
    >
      <ServerRailHome orientation={orientation} onNavigate={onNavigate} />

      <span aria-hidden className={s.divider} />

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {servers.map((server) => (
            <ServerRailItem
              key={server.id}
              isActive={server.id === activeServerId}
              orientation={orientation}
              server={server}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </ScrollArea>

      <ServerRailActions orientation={orientation} />
    </nav>
  );
};
