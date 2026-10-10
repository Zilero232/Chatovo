---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/functions.md; keep them in sync. -->

# Code style — TypeScript: functions

## Two or more parameters → one object

`resolveDisplayName({ displayName, name, email, userId })`, never positional. Single-argument functions (`listFriends(userId)`) stay positional. On the server the shape is `<Fn>Input` in `<module>.service.types.ts`.

## Block bodies

A declaration (an arrow to the right of `=`) has a block body with `return`. An expression body only for a component returning JSX and for inline callbacks (`arr.map((x) => x.id)`, a JSX prop).

## `if` always has braces

`if (!isTauri()) { return; }` — never `if (!isTauri()) return;`. A ternary returning a value is fine.

## Independent `await` calls go in parallel

The second call doesn't use the first one's result → `Promise.all`; partial failure acceptable → `Promise.allSettled`. Keep the order for a guard before a mutation, a write before a read, transaction steps.
