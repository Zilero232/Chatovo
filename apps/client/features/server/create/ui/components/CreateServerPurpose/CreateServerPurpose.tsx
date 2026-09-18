'use client';

import { Globe, Sofa } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { CreateServerPurposeProps } from './CreateServerPurpose.types';

import s from './CreateServerPurpose.module.scss';

const PURPOSES = [
  { key: 'friends', icon: <Sofa /> },
  { key: 'community', icon: <Globe /> }
] as const;

export const CreateServerPurpose = ({ onPick, onSkip }: CreateServerPurposeProps) => {
  const t = useTranslations('server.create.purpose');

  return (
    <div className={s.root}>
      {PURPOSES.map(({ key, icon }) => (
        <button key={key} className={s.option} type='button' onClick={onPick}>
          <span aria-hidden className={s.icon}>
            {icon}
          </span>
          <span className={s.label}>{t(key)}</span>
        </button>
      ))}

      <button className={s.skip} type='button' onClick={onSkip}>
        {t('skip')}
      </button>
    </div>
  );
};
