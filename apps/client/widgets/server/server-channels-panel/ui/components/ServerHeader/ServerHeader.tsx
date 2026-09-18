'use client';

import { clsx } from 'clsx';

import { Skeleton } from '@/ui-kit';

import type { ServerHeaderProps } from './ServerHeader.types';

import { ServerHeaderMenu } from '../ServerHeaderMenu/ServerHeaderMenu';

import s from './ServerHeader.module.scss';

export const ServerHeader = ({ server, serverId, tree }: ServerHeaderProps) => (
  <div className={clsx(s.root, 'surface-bar')}>
    <span aria-hidden className='accent-top-line' />

    {server ? (
      <ServerHeaderMenu server={server} serverId={serverId} tree={tree} />
    ) : (
      <Skeleton className={s.skeleton} />
    )}
  </div>
);
