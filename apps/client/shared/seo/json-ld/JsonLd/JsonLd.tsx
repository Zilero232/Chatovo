import type { JsonLdProps } from './JsonLd.types';

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw insertion
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
