import type { PageQuery } from './to-page-args.types';

/** Prisma `skip`/`take` for a 1-based page query. */
export const toPageArgs = ({ page, perPage }: PageQuery) => ({
  skip: (page - 1) * perPage,
  take: perPage
});
