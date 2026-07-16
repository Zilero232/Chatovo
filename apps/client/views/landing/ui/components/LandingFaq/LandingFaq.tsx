import { clsx } from 'clsx';

import { Text } from '@/shared/ui';

import s from '../../LandingPage.module.scss';

import type { LandingContentProps } from '../../LandingPage.types';

export const LandingFaq = ({ content }: LandingContentProps) => (
  <section className={clsx(s.container, s.section)}>
    <h2 className={s.sectionHeading}>{content.faq.heading}</h2>

    <div className={s.faqList}>
      {content.faq.items.map(({ question, answer }) => (
        <article key={question} className={clsx(s.faqItem, 'glass')}>
          <h3 className={s.faqQuestion}>{question}</h3>
          <Text className={s.faqAnswer} size="sm" tone="muted">
            {answer}
          </Text>
        </article>
      ))}
    </div>
  </section>
);
