'use client';

import { ShieldOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { CenteredState, Skeleton } from '@/ui-kit';
import { ChannelView } from '@/widgets/server/channel-view';

import { useServerPage } from '../model/hooks';

import s from './ServerPage.module.scss';

const SKELETON_KEYS = ['a', 'b', 'c'] as const;

export const ServerPage = () => {
  const t = useTranslations('server.channels');

  const { serverId, tree, channel, threadId, isLoading, isError } = useServerPage();

  return match({ serverId, isLoading, isError, channel })
    .with({ serverId: P.nullish }, () => null)
    .with({ isError: true }, () => (
      <div className={s.state}>
        <CenteredState icon={<ShieldOff />} pattern='waves' title={t('noAccess')} />
      </div>
    ))
    .with({ channel: P.nullish, isLoading: true }, () => (
      <div className={s.skeletons}>
        {SKELETON_KEYS.map((key) => (
          <Skeleton key={key} className={s.skeleton} />
        ))}
      </div>
    ))
    .with({ channel: P.nullish }, () => (
      <div className={s.state}>
        <CenteredState pattern='waves' title={t('selectChannel')} />
      </div>
    ))
    .with(
      { channel: P.nonNullable, serverId: P.nonNullable },
      ({ channel: current, serverId: id }) => (
        <ChannelView
          key={current.id}
          channel={current}
          serverId={id}
          threadId={threadId}
          tree={tree}
        />
      )
    )
    .otherwise(() => null);
};
