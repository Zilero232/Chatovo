'use client';

import { Compass, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { useServers } from '@/entities/server/server';
import { CreateServerDialog } from '@/features/server/create';
import { JoinServerDialog } from '@/features/server/join';
import { Button, CenteredState, Row, Skeleton } from '@/ui-kit';

import { LobbyServerCard } from '../LobbyServerCard/LobbyServerCard';

import s from './LobbyServers.module.scss';

const SKELETON_KEYS = ['a', 'b', 'c'] as const;

export const LobbyServers = () => {
  const t = useTranslations('lobby');

  const { servers, isLoading, isEmpty: hasNoServers } = useServers();

  const actions = (
    <Row wrap gap='2' justify='center'>
      <CreateServerDialog
        trigger={
          <Button type='button'>
            <Plus />
            {t('createServer')}
          </Button>
        }
      />
      <JoinServerDialog
        trigger={
          <Button type='button' variant='outline'>
            <Compass />
            {t('joinServer')}
          </Button>
        }
      />
    </Row>
  );

  return (
    <section className={s.root}>
      <header className={s.header}>
        <h2 className={s.heading}>{t('serversHeading')}</h2>
        {!hasNoServers && actions}
      </header>

      {match({ isLoading, hasNoServers })
        .with({ isLoading: true }, () => (
          <div className={s.grid}>
            {SKELETON_KEYS.map((key) => (
              <Skeleton key={key} className={s.skeleton} />
            ))}
          </div>
        ))
        .with({ hasNoServers: true }, () => (
          <CenteredState
            action={actions}
            description={t('empty.text')}
            pattern='waves'
            title={t('empty.title')}
          />
        ))
        .otherwise(() => (
          <div className={s.grid}>
            {servers.map((server) => (
              <LobbyServerCard key={server.id} server={server} />
            ))}
          </div>
        ))}
    </section>
  );
};
