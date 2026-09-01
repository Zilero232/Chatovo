'use client';

import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import { useContributors } from '@/entities/app/release';
import { openExternal } from '@/shared/lib';
import { Badge } from '@/ui-kit';

import s from './LobbyContributors.module.scss';

export const LobbyContributors = () => {
  const t = useTranslations('lobby.contributors');

  const { data: contributors } = useContributors();

  if (!contributors || isEmpty(contributors)) {
    return null;
  }

  return (
    <section className={s.root}>
      <header className={s.header}>
        <h2 className={s.title}>{t('title')}</h2>
        <Badge size='sm' tone='muted'>
          {contributors.length}
        </Badge>
      </header>

      <ul className={s.list}>
        {contributors.map((contributor) => (
          <li key={contributor.login}>
            <button
              className={s.item}
              title={t('commits', { count: contributor.contributions })}
              type='button'
              onClick={() => openExternal(contributor.html_url)}
            >
              <img
                alt={contributor.login}
                className={s.avatar}
                loading='lazy'
                src={contributor.avatar_url}
              />
              <span className={s.name}>{contributor.login}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
