import { clsx } from 'clsx';

import { Text } from '@/shared/ui';

import s from '../../LandingPage.module.scss';

import type { LandingContentProps } from '../../LandingPage.types';

export const LandingFeatures = ({ content }: LandingContentProps) => (
  <section className={clsx(s.container, s.section)}>
    <h2 className={s.sectionHeading}>{content.features.heading}</h2>

    <div className={s.features}>
      {content.features.items.map(({ key, Icon, title, description }) => (
        <article key={key} className={clsx(s.featureCard, 'glass')}>
          <span aria-hidden className={s.featureIcon}>
            <Icon />
          </span>
          <h3 className={s.featureTitle}>{title}</h3>
          <Text size="sm" tone="muted">
            {description}
          </Text>
        </article>
      ))}
    </div>
  </section>
);
