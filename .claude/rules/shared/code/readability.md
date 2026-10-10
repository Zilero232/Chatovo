---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/readability.md; keep them in sync. -->

# Code style — TypeScript: destructuring

A value reached through the dot 2+ times, or arriving nested, is destructured once (`const { size, type } = file`). Don't destructure a single access, a value whose bare name loses its owner (`user.name`), or a namespace object (`router`, `Math`).
