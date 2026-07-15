import { clsx } from 'clsx';
import { useId } from 'react';

import {
  centeredStateIconBoxVariants,
  centeredStateTitleVariants,
  centeredStateVariants,
} from './CenteredState.variants';

import s from './CenteredState.module.scss';

import type { CenteredStateProps } from './CenteredState.types';

export const CenteredState = ({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: CenteredStateProps) => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <section
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className={centeredStateVariants({ size, className })}
    >
      {icon && (
        <div aria-hidden className={clsx('glass', centeredStateIconBoxVariants({ size }))}>
          {icon}
        </div>
      )}
      <h2 className={centeredStateTitleVariants({ size })} id={titleId}>
        {title}
      </h2>
      {description && (
        <p className={s.description} id={descriptionId}>
          {description}
        </p>
      )}
      {action && <div className={s.action}>{action}</div>}
    </section>
  );
};
