import { JsonLd } from '@/shared/seo';

import type { LandingFaqJsonLdProps } from './LandingFaqJsonLd.types';

export const LandingFaqJsonLd = ({ items }: LandingFaqJsonLdProps) => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    }}
  />
);
