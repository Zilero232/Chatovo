import { clsx } from 'clsx';
import s from './CenteredState.module.scss';
import type { ReactNode } from 'react';

type CenteredStateSize = 'sm' | 'md';

type CenteredStateProps = {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  size?: CenteredStateSize;
  className?: string;
};

export const CenteredState = ({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: CenteredStateProps) => {
  return (
    <div className={clsx(s.root, size === 'sm' ? s.sizeSm : s.sizeMd, className)}>
      {icon && (
        <div className={clsx('glass', s.iconBox, size === 'sm' ? s.iconBoxSm : s.iconBoxMd)}>
          {icon}
        </div>
      )}
      <h2 className={clsx(s.title, size === 'sm' ? s.titleSm : s.titleMd)}>{title}</h2>
      {description && <p className={s.description}>{description}</p>}
      {action && <div className={s.action}>{action}</div>}
    </div>
  );
};
