---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/imports-and-barrels.md; keep them in sync. -->

# Code style — TypeScript: imports and barrels

Groups, a blank line between, sorted by `bun lint:fix`: external types → external values → `@/` types → `@/` values → relative types → relative values → styles. Don't hand-edit the order.

A deep import past a barrel is banned (`@/ui-kit`, not `@/ui-kit/primitives/Button`). `export * from` is banned — explicit named exports only. A barrel exports only what is needed outside.
