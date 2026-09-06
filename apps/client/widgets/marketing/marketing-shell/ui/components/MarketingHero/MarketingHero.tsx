import { clsx } from 'clsx';

import { RevealOnScroll, Text } from '@/ui-kit';

import type { MarketingHeroProps } from './MarketingHero.types';

import s from '../../MarketingShell.module.scss';

export const MarketingHero = ({ title, description, eyebrow, children }: MarketingHeroProps) => (
  <section className={clsx(s.container, s.hero)}>
    {eyebrow && (
      <RevealOnScroll>
        <Text as='span' className={s.eyebrow} size='xs' weight='medium'>
          <span aria-hidden className={s.eyebrowDot} />
          {eyebrow}
        </Text>
      </RevealOnScroll>
    )}

    <RevealOnScroll delay={0.06}>
      <Text as='h1' className={clsx(s.heroTitle, 'gradient-text')} weight='bold'>
        {title}
      </Text>
    </RevealOnScroll>

    <RevealOnScroll delay={0.12}>
      <Text className={s.heroDescription} size='lg' tone='muted'>
        {description}
      </Text>
    </RevealOnScroll>

    {children && (
      <RevealOnScroll delay={0.18}>
        <div className={s.heroActions}>{children}</div>
      </RevealOnScroll>
    )}
  </section>
);
