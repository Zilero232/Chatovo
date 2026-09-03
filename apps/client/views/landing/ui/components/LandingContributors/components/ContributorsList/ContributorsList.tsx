'use client';

import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import { useContributors } from '@/entities/app/release';
import { openExternal } from '@/shared/lib';

import s from './ContributorsList.module.scss';

export const ContributorsList = () => {
  const t = useTranslations('landing.contributors');

  const { data: contributors } = useContributors();

  if (!contributors || isEmpty(contributors)) {
    return null;
  }

  return (
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
  );
};
