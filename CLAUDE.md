# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep it short, link out for details.

## What this is

Chatovo — real-time voice rooms (web + desktop). Bun-workspaces monorepo.

- **Web client**: Next.js 16 / React 19 (`apps/client/`)
- **Desktop**: Tauri 2 (Rust) wraps the same client (`apps/tauri/`)
- **API**: NestJS on Bun + Prisma + self-hosted Postgres, auth via better-auth (`apps/server/`)
- **Realtime media**: LiveKit SFU (WebRTC), server-issued JWTs
- **Shared types**: Zod schemas in `packages/schemas/` (workspace dep `@chatovo/schemas`)

## Layout

```text
apps/
├── client/          # Next.js — FSD architecture (CLAUDE.md)
├── server/          # NestJS API — modules/ (module+controller+service+dto), lib/, core/, common/ (CLAUDE.md)
└── tauri/           # Rust shell (src/), capabilities/, tauri.conf.json (CLAUDE.md)
packages/schemas/    # Zod schemas (@chatovo/schemas), imported by client and server; grouped by domain
docs/
├── fsd.md           # Frontend (apps/client) architecture — read before structural changes
└── style.md         # Code style, import order, naming
infra/               # Caddy + LiveKit configs
```

Each app folder has its own `CLAUDE.md` (see [Per-app guidance](#per-app-guidance)).

## Per-app guidance

Each app has its own `CLAUDE.md` (auto-loaded when working in its folder) with the detailed map and local conventions:

- **[apps/client/CLAUDE.md](apps/client/CLAUDE.md)** — Feature-Sliced Design layers, public-API/barrel rules, naming, i18n, `shared/ui` layout. Full FSD spec in [docs/fsd.md](docs/fsd.md), code style in [docs/style.md](docs/style.md).
- **[apps/server/CLAUDE.md](apps/server/CLAUDE.md)** — module convention (routes / handlers / service / `lib`), error handling, LiveKit/Prisma specifics.
- **[apps/tauri/CLAUDE.md](apps/tauri/CLAUDE.md)** — Rust shell, plugins, `isTauri()` gating.

The rules below apply repo-wide (every app and `packages/`).

## Reuse over reinvention

**Rule**: before writing a helper / hook / util by hand, check if the installed libs already have it. Hand-rolled code only when nothing fits. This avoids duplicating bug-fixed, tested logic and keeps bundle predictable.

**Checklist before writing custom code:**

1. Generic React hooks (debounce, throttle, copy, mount, idle, intersection, media query, local storage, event listener, click outside, hover, boolean toggle, previous, timeout, interval, etc.) → check **`@siberiacancode/reactuse`** first. It's already a dep. Examples: `useBoolean`, `useCounter`, `useDebounceValue`, `useEventListener`, `useClickOutside`, `useLocalStorage`, `useMediaQuery`, `createContextHook`.
2. Array / object / data manipulation (groupBy, sortBy, pick, omit, partition, unique, mapValues, entries, isNullish, etc.) → use **`remeda`**. Already imported across the codebase.
3. Conditional rendering / pattern matching / discriminated unions → use **`ts-pattern`** (`match`, `.with`, `.exhaustive`, `P.*` patterns). No hand-rolled if/else ladders for typed branching.
4. Form state + validation → **`react-hook-form`** + **`@hookform/resolvers/zod`** + Zod schemas from `@chatovo/schemas`. No useState-driven forms.
5. Server state, caching, mutations, query keys → **`@tanstack/react-query`** (`useQuery`, `useMutation`, `QueryClient`). All query keys live in `shared/constants/query-keys.ts`. No `useEffect + fetch` patterns.
6. Date / time → **`date-fns`** (already in deps). No `Date` arithmetic by hand.
7. Class composition → **`clsx`** напрямую. Не оборачивать в `cn()`.
8. Validation schemas → **Zod 4** via `@chatovo/schemas`. Schema is source of truth, infer types with `z.infer`.
9. UI primitives (dialog, dropdown, tooltip, popover, tabs, switch, etc.) → **react-aria-components** (+ **react-aria** где нужны хуки) в `shared/ui/`. Стили — **SCSS modules** (`*.module.scss`). Не реализуй focus trap / aria с нуля.
10. Icons → **`lucide-react`**. No custom SVG inline unless brand-specific.
11. Toasts → **`sonner`** (`toast.success` / `toast.error`). No custom notification system.
12. LiveKit room state, participants, tracks, chat → **`@livekit/components-react`** hooks (`useChat`, `useParticipants`, `useTracks`, `useConnectionState`). No raw `Room` event listeners unless the hook genuinely doesn't cover it.
13. Tauri APIs (window, fs, deep-link, updater, global-shortcut, opener, os, process) → **`@tauri-apps/api`** + plugin packages. Always gate with `isTauri()`.
14. Internationalization → **`next-intl`** (`useTranslations`, `useFormatter`, `useLocale`). No string maps.
15. Markdown rendering (chat messages) → **`react-markdown`** + **`remark-gfm`**. No hand-rolled markdown-to-JSX. Custom renderers passed via `components` prop.
16. Color picker → **`react-colorful`** (profile banner color). No custom HSL/hex picker.
17. Animated number transitions → **`@number-flow/react`** (lobby stats, counters). No hand-tweened number rollups.
18. Keyboard event → human-readable combo string → **`keyboard-event-to-string`** (shortcut recording UI). No hand-rolled key formatter.
19. Cross-app pub/sub events → typed **`appBus`** in `shared/lib/app-bus` (built on reactuse `createEventEmitter`). For app-wide events (mute/deafen toggle, PTT, recheck-update) use the bus instead of `window` `CustomEvent` — types are enforced in `AppBusEvents`.
20. Calling a fresh callback/prop from inside `useEffect` without making the effect re-run → **`useEffectEvent`** (React 19.2+). Do NOT hand-roll the `const cbRef = useRef(cb); cbRef.current = cb;` pattern to read a "latest" callback — `useEffectEvent` is the idiomatic replacement (the effect omits the event from its deps). The ref-latest pattern is only acceptable for non-callback mutable values that genuinely can't use an Effect Event.
21. Анимации появления/исчезновения, layout-переходы, stagger → **`motion`** (`motion.div`, `AnimatePresence`, `useReducedMotion`). В CSS остаются только hover/focus-транзишны, бесконечные лупы (спиннер, пульс) и декоративный фон. Не пиши `@keyframes` для enter/exit — они не реагируют на стейт и конфликтуют с motion.
22. Выбор файла → **`useFileDialog`** (reactuse) + `FilePicker` из `shared/ui`. Нативный `<input type="file">` не стилизуется и выбивается из дизайна.

**When to roll your own:**

- Project-specific glue that no lib reasonably covers.
- Domain logic (`entities/`, `features/` business rules).
- Thin wrappers over lib APIs to enforce project conventions (e.g. a typed `useEventListener` for a specific custom event name).
- Lib has a real gotcha that hurts the call site. Document known ones:
  - `useBoolean` from `@siberiacancode/reactuse` returns a **new toggle function every render** — using it as a setter inside `useEffect` deps triggers `useExhaustiveDeps` warnings and re-runs the effect on each render. Use plain `useState(false)` when the setter is passed into effects, callbacks, or refs. `useBoolean` is fine for inline `<button onClick={() => toggle()}>`.
  - `useEventListener` from reactuse types `event` as `keyof WindowEventMap` — custom event names need a cast or module augmentation. For one-off custom events, plain `addEventListener` + cleanup is shorter.
  - `Intl.NumberFormat` with `style: 'unit', unit: 'byte', notation: 'compact'` produces inconsistent output (`1.5kB` vs `1.5K B`) across `unitDisplay` values. Hand-rolled byte formatter is fine.
  - Browser back/forward availability (`shared/hooks/use-nav-history`) uses the native **Navigation API** (`window.navigation.canGoBack/canGoForward` + `currententrychange`) via `useSyncExternalStore` — reactuse has no equivalent. Chromium-only (fine: title-bar nav is Tauri/WebView2-only); gate with `'navigation' in window`, falls back to disabled buttons elsewhere.

**Process when adding a feature:**

1. Identify what category the new code falls into (state, side-effect, data, UI primitive, validation, ...).
2. Search the existing dep tree (`package.json` + `bun.lock`) for a fitting helper.
3. If nothing fits — check whether a lib **already used elsewhere in the codebase** has it (grep for similar patterns).
4. Only then write custom — and put it in `shared/lib/` or `shared/hooks/` if reusable, otherwise in the slice's `lib/` segment.

## Common commands

```bash
# Root
bun dev                    # client + server in parallel
bun dev:client             # client only
bun dev:server             # server only
bun dev:livekit            # local SFU + Caddy via docker
bun dev:full               # docker + bun dev
bun lint                   # biome check (TS/JS)
bun lint:fix               # biome check --write
bun lint:css               # stylelint (SCSS)
bun lint:css:fix           # stylelint --fix — сортирует свойства, чинит порядок
bun build                  # server + client production build

# Tauri (desktop)
bun tauri:dev              # run Tauri dev shell
bun tauri:build            # produce native binary

# Server / Prisma (run from apps/server/)
bun db:push                # push schema without migration (USE THIS — see note)
bun db:migrate             # create + apply migration
bun db:deploy              # apply pending migrations (prod)
bun db:studio              # Prisma Studio GUI

# Typecheck (no script — run directly)
cd apps/client && bun x tsc --noEmit
```

> **DB schema changes**: prefer `bun db:push` for iterating locally (applies the diff directly, no migration files). Schema lives in `apps/server/prisma/schema/*.prisma` (split per domain: `auth`, `room`, `message`) plus `prisma/base.prisma` (generator + datasource). Auth is **better-auth** on a self-hosted Postgres — the `user`/`session`/`account`/`verification` tables live in `auth.prisma` and are fully owned by Prisma (no introspected Supabase schema anymore). Profile fields (displayName, avatarUrl, bannerColor, bio, verified) live in a separate `Profile` table (1-1 FK to `user`), auto-created by a better-auth `databaseHook` on signup. File uploads (avatars, chat attachments) are written to the `UPLOADS_DIR` folder on disk by the server (`lib/uploads.ts`) and served back under `/uploads`.

## Working with the user

- **Language**: respond in Russian. Code, identifiers, commit messages, and quoted error strings stay in their original language (usually English).
- **No code comments**: don't add `//` or block/JSDoc comments. Code is self-documenting via clear naming. Add a comment only when the user explicitly asks for one. Leave pre-existing comments in files you didn't author unless told to clean them.
- **No git operations on your own**: never `git commit` / `branch` / `push` unless the user explicitly asks in that message. Stage (`git add`) at most. A task instruction like "go do X" is NOT a commit request.
- **Measure before swapping for perf**: if a performance symptom persists across two implementation swaps, the cause is almost certainly not the library — stop swapping. First do ONE of: repeat the action (fast 2nd time = first-mount/dev-compile, not the lib), test a prod build (`bun run build && bun run start`), or read a DevTools Performance profile. Only swap a library once a profile implicates its code.

## Workflow

- **Type checking**: there's no `typecheck` script. Run `bun x tsc --noEmit` from `apps/client/` (or relevant workspace).
- **Lint**: `bun lint:fix` runs Biome (TS/JS); it also sorts imports and exports automatically. Don't fight its output.
- **Lint SCSS**: `bun lint:css:fix` runs Stylelint — сортирует свойства (порядок из `stylelint-config-clean-order`), запрещает ручные вендор-префиксы, ловит свойства без эффекта и `transition` на не-compositor свойствах. Конфиг — [stylelint.config.mjs](stylelint.config.mjs). Оба линтера подключены к pre-commit через lint-staged.
- **Tests**: none currently. Don't fabricate test commands.
- **Commits**: Conventional Commits style (see git log).
- **Branches**: feature branches off `master`. PRs target `master`.

## Things to avoid (repo-wide)

- **No emojis in code** unless explicitly requested.
- **Don't put business logic in `shared/`** (client) — it's project-agnostic; domain hooks/types belong in `features/` or `entities/`.
- **Don't bundle Tauri APIs unconditionally** — gate with `isTauri()` so the web build keeps working.

App-specific "don'ts" (route files server-side, no deep imports past barrels, don't edit generated `messages.d.ts`, etc.) live in the per-app `CLAUDE.md` files above.
