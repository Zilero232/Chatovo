# CLAUDE.md — apps/client

Guidance for Claude Code when working in the web client. Extends the root [../../CLAUDE.md](../../CLAUDE.md); root rules still apply.

Web client — **Next.js 16 / React 19**, App Router. Also the UI loaded by the Tauri desktop shell ([apps/tauri](../tauri/)).

Architecture is **Feature-Sliced Design** with two local tweaks (`pages` → `views`, slices grouped by business domain). Read these before structural changes:

- **[../../docs/architecture/fsd.md](../../docs/architecture/fsd.md)** — layers, import direction, public-API rules
- **[../../docs/guides/style.md](../../docs/guides/style.md)** — naming, segments, import order (FULL version: examples + reasoning)
- **[../../CLAUDE.md](../../CLAUDE.md)** — repo-wide guidance, reuse-first rules

The compact code-style digest is [../../.claude/rules/code-style-client.md](../../.claude/rules/code-style-client.md) (plus the shared [code-style.md](../../.claude/rules/code-style.md)); it loads automatically when you edit files under `apps/client`. The full version is `docs/guides/style.md`; when a rule changes, update both places.

## Layer map

```
app/        # Next.js routes (thin server wrappers) + providers/. No 'use client' in page/layout.
views/      # whole screens per route (canon FSD: pages/) — auth, error, home, legal, lobby, not-found, reset-password, room
widgets/    # large composable UI blocks, grouped by domain: app/, chat/, layout/, room/, social/
features/   # user interactions w/ business value, by domain: app/, auth/, room/, social/
entities/   # base domain concepts, by domain: app/, auth/, room/, social/
shared/     # project-agnostic non-UI: api/ config/ constants/ hooks/ i18n/ lib/ seo/
ui-kit/     # design system: primitives/ (base) components/ (composed) icons/ styles/
```

Import direction (downward only): `app → views → widgets → features → entities → shared`.
`ui-kit/` sits alongside `shared/` at the bottom — every layer may import it, it imports nothing but itself.
A **widget importing a feature is correct** (it composes them) — only Feature→Widget / Entity→up are violations.

## Conventions that bite

- **Public API**: import to the slice (`@/features/auth/sign-in`), never the domain group (`@/features/auth`) or deep past the barrel.
- **`ui-kit`**: import from the single root barrel `@/ui-kit`, not per-primitive. Each primitive lives in its own PascalCase folder under `primitives/` (base) or `components/` (composed), see [../../docs/guides/style.md](../../docs/guides/style.md) §2.1.
- **SCSS shared imports**: `@use '@/ui-kit/styles/mixins' as *` — no relative `../../../` (via `sassOptions.loadPaths` + `turbopack.resolveAlias` in `next.config.ts`).
- **`model/` barrels** live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts`.
- **Per-component barrels — only in `ui-kit`**: there every primitive folder carries its own `index.ts` (`export { Button } from './Button'; export type { ButtonProps } from './Button.types';`). In `views/` `widgets/` `features/` `entities/` do **not** create per-component `index.ts` files: the aggregating `ui/components/index.ts` points straight at the file (`export { X } from './X/X'`), and the parent imports through it.
- **Settings state** (`useAppSettings`, settings types) lives in `entities/app/settings` — NOT the `widgets/app/app-settings` widget (which is UI-only).
- **Shared Zod schemas** come from `@chatovo/schemas` ([../../packages/schemas](../../packages/schemas)); auth/profile/room schemas live there, not inline.
- **i18n**: `useTranslations` in client components, `getTranslations` from `next-intl/server` in server components (see `views/home`). Keys in locale JSON under `shared/i18n/locales/`. Don't edit generated `messages.d.ts`.
- Alias `@/*` → `apps/client/*`.

## Base UI gotchas

The `ui-kit` UI primitives are built on **`@base-ui/react`** (the migration off react-aria-components is complete; `react-aria` / `react-aria-components` are no longer dependencies). Always import from the subpath: `import { Menu } from '@base-ui/react/menu'`, never from the package root.

- **Package name**: in v1.0.0 the package moved from the `@base-ui-components/react` org scope to **`@base-ui/react`** (the release's only breaking change, CHANGELOG v1.0.0). The old name no longer installs or resolves — if you find it in code or docs, it is a stale leftover.

- **State attributes**: Base UI sets `data-popup-open` (an open overlay — on both the trigger and the popup), `data-highlighted` (the active menu item), `data-checked`, `data-disabled`, `data-placeholder`. Selectors from RAC (`data-selected`, `data-hovered`, `data-pressed`) and from Radix (`data-state='open'`) silently never match. Style "menu is open" as `&[data-popup-open]` and a hovered menu item as `&[data-highlighted]`.
- **`render`, not `asChild` / `Pressable`**: to have a trigger render as your own component, pass the element to `render`: `<Menu.Trigger render={<Button {...props} />} />` (see `DropdownMenu`, `Dialog`). No `Pressable` wrappers — they are gone from the codebase.
- **`onClick` works**: the `ui-kit` `Button` is a plain native `<button>` (or an `<a>` when given `href`); the `onPress` / `ButtonContext` bridge is gone. A native element can safely be passed to the `render` prop of any trigger.
- **Animating overlays**: two approaches work. (1) **CSS** — Base UI keeps the node in the DOM for the duration of the exit and sets `data-starting-style` / `data-ending-style`; write enter/exit as `&[data-starting-style] { animation: … }` (see `Dialog.module.scss`). (2) **motion** — as in `Sheet`: `<Dialog.Portal keepMounted>` plus `AnimatePresence` around the content, with `motion.div` supplied through the `render` prop of `Dialog.Backdrop` / `Dialog.Popup` so the focus trap and a11y stay with the library. The key point: with motion, `AnimatePresence` owns the exit, so the portal must be `keepMounted` and `data-starting-style` / `data-ending-style` must not be used in the styles — otherwise the two animations fight over the moment of unmount.
- **Closing on outside-press with a nested overlay**: `onOpenChange` receives `eventDetails` as its second argument, carrying `reason` (`'outside-press'`, `'escape-key'`, `'trigger-press'`, `'close-press'`, `'focus-out'`, …), a `cancel()` method and an `isCanceled` flag (the full list of reasons is in `internals/reason-parts.d.ts` in the package). Right now **no component in `ui-kit` uses this**: the `shouldKeepDialogOpen` helper and `shared/lib/nested-overlay.ts` were deleted, and `Sheet` / `Dialog` pass `onOpenChange` through as `(open: boolean) => void`. If a nested overlay starts closing the parent Dialog again, suppress it narrowly with `eventDetails.reason === 'outside-press'` + `eventDetails.cancel()` — that second argument is still there for exactly this.
- **`DropdownMenuLabel` only inside a group**: `Menu.GroupLabel` must live inside a `Menu.Group` or `Menu.RadioGroup`. A bare `<DropdownMenuLabel>` directly in `DropdownMenuContent` breaks the popup — the menu silently stops opening on click, with no console error. If you need a heading without a group, don't add one at all.
- **A toggle inside a menu is `DropdownMenuCheckboxItem`**, not a hand-made `<label>` with a `Switch`: `Menu.CheckboxItem` does not close the popup on click by default (`closeOnClick={false}`) and gives you `data-checked`, keyboard support and aria for free.
- **Select**: `onValueChange` hands back `unknown`; `BaseSelect.Value` accepts a children function `(selected) => …` to render the selected value. `data-placeholder` on the trigger is set manually (see `Select.tsx`) — it is not applied automatically.
- **Native `<button>` without its own styles**: the global reset in `globals.scss` removes the UA background; `cursor: pointer` is likewise set globally by role.

## Commands

```bash
bun dev:client                 # from repo root
bun --filter @chatovo/client typecheck # or: cd apps/client && bun typecheck
bun lint:fix                   # ESLint (from root) — sorts imports/exports
bun format                     # Prettier (from root)
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
