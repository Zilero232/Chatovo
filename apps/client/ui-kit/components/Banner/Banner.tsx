import { clsx } from 'clsx';

import type { BannerProps } from './Banner.types';

import s from './Banner.module.scss';

export const Banner = ({
  title,
  description,
  icon,
  action,
  tone = 'default',
  className
}: BannerProps) => (
  <div className={clsx(s.root, className)} data-slot='banner' data-tone={tone} role='status'>
    {icon && (
      <span aria-hidden className={s.badge}>
        {icon}
      </span>
    )}

    <div className={s.content}>
      <span className={s.title}>{title}</span>
      <p className={s.description}>{description}</p>
    </div>

    {action && <div className={s.action}>{action}</div>}
  </div>
);
