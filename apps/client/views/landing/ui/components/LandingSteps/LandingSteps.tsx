import { clsx } from 'clsx';

import { Text } from '@/shared/ui';

import s from '../../LandingPage.module.scss';

import type { LandingContentProps } from '../../LandingPage.types';

export const LandingSteps = ({ content }: LandingContentProps) => (
  <section className={clsx(s.container, s.section)}>
    <h2 className={s.sectionHeading}>{content.steps.heading}</h2>

    <ol className={s.steps}>
      {content.steps.items.map(({ key, title, description }, index) => (
        <li key={key} className={s.step}>
          <span className={s.stepIndex}>{String(index + 1).padStart(2, '0')}</span>
          <h3 className={s.stepTitle}>{title}</h3>
          <Text size="sm" tone="muted">
            {description}
          </Text>
        </li>
      ))}
    </ol>
  </section>
);
