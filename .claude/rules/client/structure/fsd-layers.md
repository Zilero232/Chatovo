---
paths:
  - 'apps/client/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/architecture/fsd.md; keep them in sync. -->

# Client — FSD layers and public API

Feature-Sliced Design with two local tweaks: `pages` → `views`, slices grouped by business domain. Imports go downward only: `app → views → widgets → features → entities → shared`. `ui-kit` sits beside `shared`: every layer may import `@/ui-kit`, it imports nothing but itself.

A **widget importing a feature is correct** — only feature → widget and entity → anything above are violations. Cross-imports between slices of one layer are banned.

## Public API

Import the slice (`@/features/auth/sign-in`), never the domain group (`@/features/auth`) and never past the barrel. `ui-kit` has one root barrel, `@/ui-kit`.

`shared/` holds no business logic — domain hooks and types go to `features/` or `entities/`. Settings state (`useAppSettings`) lives in `entities/app/settings`, not the settings widget.
