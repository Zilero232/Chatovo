---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/types.md; keep them in sync. -->

# Code style — TypeScript: types

`type` for everything — Props, unions, aliases, DTOs. `interface` is banned (`ts/consistent-type-definitions`). `unknown`, never `any`. A non-null `!` without justification is banned — use a check or `?.`. State variants are a discriminated union.

`import type` / `export type` are fixed by `bun lint:fix` — except under `apps/server/**`, where the rule is off: Nest resolves dependencies from decorator metadata, which `import type` erases.

## Props field order

One order in three places — `type Props`, the destructuring, the JSX call: **data** (incl. `children`) → **identifiers/styles** (`id`, `className`, `style`) → **handlers** (`on<Event>`).
