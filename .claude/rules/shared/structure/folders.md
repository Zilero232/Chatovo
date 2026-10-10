---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/client/segments.md; keep them in sync. -->

# Structure — one file per task, a folder per cluster

A function with no companions is a flat file (`lib/group-rooms.ts`). The moment it gains its own type, a test or a helper used only by it, it becomes a folder: `<fn-name>/<fn-name>.ts` + `index.ts` + `<fn-name>.types.ts` + `_tests/`. The same in the client's `shared/lib/` and the server's `src/lib/`.

`model/hooks/`, `model/contexts/`, `model/stores/` are the exception: files sit flat under a shared barrel until a hook has its own types and tests.
