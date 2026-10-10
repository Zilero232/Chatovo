---
paths:
  - '**/_tests/**/*.{ts,tsx}'
  - 'e2e/**/*.spec.ts'
  - '**/vitest.config.*'
  - 'playwright.config.ts'
  - 'apps/client/vitest.setup.ts'
---

<!-- Compressed editing rules, loaded automatically when a test or its config is edited. -->
<!-- The full reasoning is docs/guides/shared/testing.md; keep them in sync. -->

# Tests — running them

`bun run test` from the root — one Vitest run over the root `vitest.config.ts` `test.projects` (`schemas`, `server`, `client`). **Never bare `bun test`**: that is Bun's own runner, not Vitest. `bun run test:e2e` runs Playwright (desktop + mobile) and starts the client dev server itself. CI runs `bun run test` only.

Environments: client — jsdom + `@testing-library/react`, setup in `apps/client/vitest.setup.ts` (mocks `next/navigation`); server — node with a dummy env in its config (a new required env var goes there too, or the Prisma chain fails Zod validation on import); schemas — node, no env.
