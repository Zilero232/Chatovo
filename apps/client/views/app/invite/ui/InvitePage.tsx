'use client';

import { Compass, Link2Off } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { Button, CenteredState, Spinner } from '@/ui-kit';

import { useInvitePage } from '../model/hooks';

import s from './InvitePage.module.scss';

export const InvitePage = () => {
  const t = useTranslations('server.invitePage');
  const tJoin = useTranslations('server.join');

  const { code, preview, isLoading, isError, isJoining, join, openServer } = useInvitePage();

  return (
    <div className={s.root}>
      {match({ code, preview, isLoading, isError })
        .with({ code: P.nullish }, { isError: true }, () => (
          <CenteredState icon={<Link2Off />} pattern='waves' title={t('invalid')} />
        ))
        .with({ preview: P.nullish }, () => (
          <CenteredState icon={<Spinner />} title={t('loading')} />
        ))
        .with({ preview: P.nonNullable }, ({ preview: invite }) => (
          <CenteredState
            action={
              invite.isMember ? (
                <Button type='button' onClick={() => openServer(invite.serverId)}>
                  {t('open')}
                </Button>
              ) : (
                <Button disabled={isJoining} type='button' onClick={join}>
                  {isJoining && <Spinner decorative />}
                  {t('join')}
                </Button>
              )
            }
            description={`${invite.serverName} · ${tJoin('members', { count: invite.memberCount })}`}
            icon={<Compass />}
            pattern='waves'
            title={t('title')}
          />
        ))
        .otherwise(() => null)}
    </div>
  );
};
