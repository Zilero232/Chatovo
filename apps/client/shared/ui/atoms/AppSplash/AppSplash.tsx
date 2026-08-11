import { isNonNullish } from 'remeda';

import type { AppSplashProps } from './AppSplash.types';

import { WaveMark } from '../../icons/WaveMark';
import { Progress } from '../Progress';
import { Text } from '../Text';

import s from './AppSplash.module.scss';

export const AppSplash = ({ message, progress }: AppSplashProps) => {
  const hasProgress = isNonNullish(progress);

  return (
    <div aria-live='polite' className={s.root} role='status'>
      <div className={`glass ${s.iconBox}`}>
        <WaveMark animated size={32} />
      </div>

      <div className={s.content}>
        {message && (
          <Text align='center' size='sm' tone='muted'>
            {message}
          </Text>
        )}
        {hasProgress && <Progress className={s.progress} value={progress} />}
      </div>
    </div>
  );
};
