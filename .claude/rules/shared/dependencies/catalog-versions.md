---
paths:
  - '**/package.json'
---

<!-- Compressed editing rules, loaded automatically when a package.json is edited. -->
<!-- The full reasoning is docs/guides/shared/dependencies.md; keep them in sync. -->

# Dependencies — catalog versions

A dependency used by more than one workspace is pinned once in `workspaces.catalog` of the root `package.json` (react, react-dom, the React types, zod, typescript, remeda, ts-pattern, date-fns, better-auth) and referenced as `"zod": "catalog:"`. Bumping means editing the catalog; adding a shared dependency means the catalog **and** `catalog:` in every consumer.

A package that must move in lockstep with a catalogued one is catalogued too — `react` without `react-dom` puts two Reacts in the tree.

The bun version is pinned in `mise.toml` (and the `oven/bun` tag in both Dockerfiles), not in `package.json` — no `packageManager`, no `engines`.
