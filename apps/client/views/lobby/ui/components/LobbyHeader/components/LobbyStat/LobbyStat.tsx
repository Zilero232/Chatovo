import NumberFlow from '@number-flow/react';
import { clsx } from 'clsx';

import s from '../../LobbyHeader.module.scss';

import type { LobbyStatProps } from './LobbyStat.types';

export const LobbyStat = ({ icon, label, tone, value }: LobbyStatProps) => (
  <div className={clsx(s.stat, 'surface-card')} data-tone={tone}>
    <span aria-hidden className={s.statGlow} data-tone={tone} />
    <span className={s.statIconWrap} data-tone={tone}>
      {icon}
    </span>
    <span className={s.statTextWrap}>
      <NumberFlow className={s.statValue} value={value} />
      <span className={s.statLabel}>{label}</span>
    </span>
  </div>
);
