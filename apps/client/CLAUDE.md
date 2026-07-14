# CLAUDE.md — apps/client

Guidance for Claude Code when working in the web client. Extends the root [../../CLAUDE.md](../../CLAUDE.md); root rules still apply.

Web client — **Next.js 16 / React 19**, App Router. Also the UI loaded by the Tauri desktop shell ([apps/tauri](../tauri/)).

Architecture is **Feature-Sliced Design** with two local tweaks (`pages` → `views`, slices grouped by business domain). Read these before structural changes:

- **[../../docs/fsd.md](../../docs/fsd.md)** — layers, import direction, public-API rules
- **[../../docs/style.md](../../docs/style.md)** — naming, segments, import order
- **[../../CLAUDE.md](../../CLAUDE.md)** — repo-wide guidance, reuse-first rules

## Layer map

```
app/        # Next.js routes (thin server wrappers) + providers/. No 'use client' in page/layout.
views/      # whole screens per route (canon FSD: pages/) — auth, lobby, room, reset-password
widgets/    # large composable UI blocks, grouped by domain: app/, layout/, room/
features/   # user interactions w/ business value, by domain: app/, auth/, room/
entities/   # base domain concepts, by domain: app/, auth/, room/
shared/     # project-agnostic: api/ ui/ lib/ hooks/ i18n/ config/ constants/ seo/
```

Import direction (downward only): `app → views → widgets → features → entities → shared`.
A **widget importing a feature is correct** (it composes them) — only Feature→Widget / Entity→up are violations.

## Conventions that bite

- **Public API**: import to the slice (`@/features/auth/sign-in`), never the domain group (`@/features/auth`) or deep past the barrel.
- **`shared/ui`**: import from the single root barrel `@/shared/ui`, not per-primitive. Each primitive lives in its own PascalCase folder (see [../../docs/style.md](../../docs/style.md) §2.1).
- **SCSS shared imports**: `@use '@/shared/styles/mixins' as *` — без относительных `../../../` (`sassOptions.loadPaths` + `turbopack.resolveAlias` в `next.config.ts`).
- **`model/` barrels** live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts`.
- **Settings state** (`useAppSettings`, settings types) lives in `entities/app/settings` — NOT the `widgets/app/app-settings` widget (which is UI-only).
- **Shared Zod schemas** come from `@chatovo/schemas` ([../../packages/schemas](../../packages/schemas)); auth/profile/room schemas live there, not inline.
- **i18n**: all strings via `useTranslations`; keys in locale JSON under `shared/i18n/locales/`. Don't edit generated `messages.d.ts`.
- Alias `@/*` → `apps/client/*`.

## Commands

```bash
bun dev:client                 # from repo root
cd apps/client && bun x tsc --noEmit   # typecheck (no script)
bun lint:fix                   # Biome (from root) — sorts imports/exports
```
