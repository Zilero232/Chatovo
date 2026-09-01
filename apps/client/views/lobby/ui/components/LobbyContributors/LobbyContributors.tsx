'use client';

import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import { useDevelopers, UserAvatar, UserName } from '@/entities/auth/user';
import { AvatarWithBadges, Badge } from '@/ui-kit';

import s from './LobbyContributors.module.scss';

export const LobbyContributors = () => {
  const t = useTranslations('lobby.contributors');

  const { data: developers } = useDevelopers();

  if (!developers || isEmpty(developers)) {
    return null;
  }

  return (
    <section className={s.root}>
      <header className={s.header}>
        <h2 className={s.title}>{t('title')}</h2>
        <Badge size='sm' tone='muted'>
          {developers.length}
        </Badge>
      </header>

      <ul className={s.list}>
        {developers.map((developer) => (
          <li key={developer.id} className={s.item}>
            <AvatarWithBadges>
              <UserAvatar className={s.avatar} name={developer.name} src={developer.avatarUrl} />
            </AvatarWithBadges>

            <UserName
              className={s.name}
              developer={developer.developer}
              name={developer.name}
              profileUrl={developer.profileUrl}
              verified={developer.verified}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
