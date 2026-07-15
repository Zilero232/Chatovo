import { isNonNullish } from 'remeda';

import { Progress } from '../Progress';
import { Spinner } from '../Spinner';

import s from './AppSplash.module.scss';

import type { AppSplashProps } from './AppSplash.types';

export const AppSplash = ({ message, progress }: AppSplashProps) => {
  const hasProgress = isNonNullish(progress);

  return (
    <div className={s.root}>
      <div className={`glass ${s.iconBox}`}>
        <Spinner size="lg" />
      </div>

      <div className={s.content}>
        {message && <p className={s.message}>{message}</p>}
        {hasProgress && <Progress className={s.progress} value={progress} />}
      </div>
    </div>
  );
};
