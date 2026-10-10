---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/blank-lines.md; keep them in sync. -->

# Code style — TypeScript: blank lines

Held by hand — no linter enforces it. A blank line before `return` (unless it is the first statement), `throw`, `if`, `try` / `for` / `while` / `switch`, an `await` that starts a separate step, and after every `if` block.

No blank line inside a single-statement block or between consecutive `const`s of one logical step.
