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
├── server/          # NestJS API — modules/ (module+controller+services/+dto+lib/), lib/, core/, common/ (CLAUDE.md)
└── tauri/           # Rust shell (src/), capabilities/, tauri.conf.json (CLAUDE.md)
packages/schemas/    # Zod schemas (@chatovo/schemas), imported by client and server; grouped by domain
.github/            # CI: workflows/release.yml, workflows/deploy.yml, actions/setup/
.claude/rules/       # Compact code-style rules with a paths frontmatter (auto-loaded while editing)
├── code-style.md        # whole repo: **/*.{ts,tsx,js,jsx}
├── code-style-client.md # apps/client/**
├── code-style-server.md # apps/server/**
└── testing.md           # **/_tests/**, e2e/**, vitest + playwright configs
docs/
├── architecture/
│   ├── fsd.md            # Frontend (apps/client) architecture — read before structural changes
│   ├── room-session.md   # The call outlives navigation: session above the route, collapsed bar
│   ├── game-activity.md  # "Playing X" status: Steam manifests + exe metadata, opt-in, desktop-only
│   ├── invisible-mode.md # admin joins rooms hidden: server-enforced, presence filtered
│   └── tray-menu.md      # Native tray menu: Rust-owned icon + menu, labels/state pushed from the client
├── guides/
│   ├── style.md          # Code style, import order, naming — FULL version (examples + rationale)
│   ├── developer-role.md # user.role = admin: contributors strip, developers tab, badges
│   └── migrations.md     # Prisma migrations: baseline, deploy order, better-auth schema drift
└── rustore/              # RuStore release: listing, data safety, signing, moderation
infra/               # Caddy + LiveKit configs
```

**Code style comes in two versions.** [docs/guides/style.md](docs/guides/style.md) is the full one: examples, anti-patterns, rationale; read it on demand, and the reviewer agent reads it end to end. `.claude/rules/*.md` are the compact digests, loaded automatically when you edit matching files (the `paths:` frontmatter). When a rule changes, update both places.

**Env**: a single shared `.env` at the repo root covers both client and server (`.env.example` is the template). The client reads `NEXT_PUBLIC_*` out of it via `loadRootEnv()` in [apps/client/next.config.ts](apps/client/next.config.ts). Only `apps/tauri/` has its own `.env` (machine-specific Android SDK/JDK paths). Release and deploy credentials live only in GitHub Secrets — there are no local env files for them; each workflow lists the secrets it needs in its header. Everything except `*.example` is in `.gitignore`.

Each app folder has its own `CLAUDE.md` (see [Per-app guidance](#per-app-guidance)).

## Per-app guidance

Each app has its own `CLAUDE.md` (auto-loaded when working in its folder) with the detailed map and local conventions:

- **[apps/client/CLAUDE.md](apps/client/CLAUDE.md)** — Feature-Sliced Design layers, public-API/barrel rules, naming, i18n, `ui-kit` layout. Full FSD spec in [docs/architecture/fsd.md](docs/architecture/fsd.md), code style in [docs/guides/style.md](docs/guides/style.md) (compressed: [.claude/rules/code-style-client.md](.claude/rules/code-style-client.md)).
- **[apps/server/CLAUDE.md](apps/server/CLAUDE.md)** — module convention (routes / handlers / service / `lib`), error handling, LiveKit/Prisma specifics (compressed style: [.claude/rules/code-style-server.md](.claude/rules/code-style-server.md)).
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
7. Class composition → **`clsx`** directly. Do not wrap it in a `cn()` helper.
8. Validation schemas → **Zod 4** via `@chatovo/schemas`. Schema is source of truth, infer types with `z.infer`.
9. UI primitives (dialog, dropdown, tooltip, popover, tabs, switch, etc.) → **`@base-ui/react`** inside `ui-kit/` (import from the subpath: `@base-ui/react/menu`). Styling is **SCSS modules** (`*.module.scss`). Don't implement focus trap / aria from scratch. Base UI gotchas are in [apps/client/CLAUDE.md](apps/client/CLAUDE.md).
10. Icons → **`lucide-react`**. No custom SVG inline unless brand-specific.
11. Toasts → **`sonner`** (`toast.success` / `toast.error`). No custom notification system.
12. LiveKit room state, participants, tracks, chat → **`@livekit/components-react`** hooks (`useChat`, `useParticipants`, `useTracks`, `useConnectionState`). No raw `Room` event listeners unless the hook genuinely doesn't cover it.
13. Tauri APIs (window, fs, deep-link, updater, global-shortcut, opener, os, process) → **`@tauri-apps/api`** + plugin packages. Always gate with `isTauri()`.
14. Internationalization → **`next-intl`** (`useTranslations`, `useFormatter`, `useLocale`). No string maps.
15. Markdown rendering (chat messages) → **`react-markdown`** + **`remark-gfm`** + **`remark-breaks`**. No hand-rolled markdown-to-JSX. Custom renderers passed via `components` prop.
16. Color picker → **`react-colorful`** (profile banner color). No custom HSL/hex picker.
17. Animated number transitions → **`@number-flow/react`** (lobby stats, counters). No hand-tweened number rollups.
18. Keyboard event → human-readable combo string → **`keyboard-event-to-string`** (shortcut recording UI). No hand-rolled key formatter.
19. Cross-app pub/sub events → typed **`appBus`** in `shared/lib/app-bus` (built on reactuse `createEventEmitter`). For app-wide events (mute/deafen toggle, PTT, recheck-update) use the bus instead of `window` `CustomEvent` — types are enforced in `AppBusEvents`.
20. Calling a fresh callback/prop from inside `useEffect` without making the effect re-run → **`useEffectEvent`** (React 19.2+). Do NOT hand-roll the `const cbRef = useRef(cb); cbRef.current = cb;` pattern to read a "latest" callback — `useEffectEvent` is the idiomatic replacement (the effect omits the event from its deps). The ref-latest pattern is only acceptable for non-callback mutable values that genuinely can't use an Effect Event.
21. Enter/exit animations, layout transitions, stagger → **`motion`** (`motion.div`, `AnimatePresence`, `useReducedMotion`). CSS keeps only hover/focus transitions, infinite loops (spinner, pulse) and decorative backgrounds. Don't write `@keyframes` for enter/exit — they don't react to state and they fight with motion.
22. File selection → **`useFileDialog`** (reactuse) + `FilePicker` from `ui-kit`. A native `<input type="file">` can't be styled and breaks the design.

**When to roll your own:**

- Project-specific glue that no lib reasonably covers.
- Domain logic (`entities/`, `features/` business rules).
- Thin wrappers over lib APIs to enforce project conventions (e.g. a typed `useEventListener` for a specific custom event name).
- Lib has a real gotcha that hurts the call site. Document known ones:
  - `useBoolean` from `@siberiacancode/reactuse` returns a **new toggle function every render** — using it as a setter inside `useEffect` deps triggers `useExhaustiveDeps` warnings and re-runs the effect on each render. Use plain `useState(false)` when the setter is passed into effects, callbacks, or refs. `useBoolean` is fine for inline `<button onClick={() => toggle()}>`.
  - `useEventListener` from reactuse types `event` as `keyof WindowEventMap` — custom event names need a cast or module augmentation. For one-off custom events, plain `addEventListener` + cleanup is shorter.
  - `Intl.NumberFormat` with `style: 'unit', unit: 'byte', notation: 'compact'` produces inconsistent output (`1.5kB` vs `1.5K B`) across `unitDisplay` values. Hand-rolled byte formatter is fine.
  - `useAudio` from reactuse has no `loop` option and returns only controls (`play`/`pause`/`stop`/`setVolume`), never the `HTMLAudioElement`. Looping sound (call ringtone) needs a manual `new Audio()` — see `entities/social/friend/model/hooks/use-friend-call-ringtone.ts`. One-shot sounds should still use `useAudio`.
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
bun lint                   # eslint (TS/JS)
bun lint:fix               # eslint --fix
bun lint:css               # stylelint (SCSS)
bun lint:css:fix           # stylelint --fix — sorts properties, fixes ordering
bun format                 # prettier --write
bun format:check           # prettier --check
bun verify                 # typecheck + lint + format:check + lint:css — run before committing
bun fix                    # lint:fix + format + lint:css:fix
bun lint:rust              # clippy on apps/tauri (not part of verify — needs cargo)
bun test                   # Vitest, whole monorepo in one run (not part of verify)
bun test:coverage          # same plus a v8 coverage report
bun test:e2e               # Playwright, starts the client dev server itself
bun build                  # client production build (the server has no build — Bun runs TS directly)

# Release / deploy — only through GitHub Actions, there are no local scripts anymore.
#   release: git tag vX.Y.Z && git push --tags  (or Actions → release → Run workflow)
#            checks → draft → desktop (win/mac aarch64+x86_64/linux) + android → publish
#   deploy:  Actions → deploy → Run workflow (ghcr + ssh to the VPS, manual)
# Secrets — Settings → Secrets and variables → Actions (each workflow lists them in its header).

# Tauri (desktop)
bun tauri:dev              # run Tauri dev shell
bun tauri:build            # produce native binary
bun android:build          # APK + AAB (needs SDK/NDK, see apps/tauri/.env)

# Server / Prisma (run from apps/server/)
bun db:push                # push schema without migration (USE THIS — see note)
bun db:migrate             # create + apply migration
bun db:deploy              # apply pending migrations (prod)
bun db:studio              # Prisma Studio GUI

# Typecheck
bun typecheck               # all workspaces
bun --filter @chatovo/client typecheck
```

> **DB schema changes**: prefer `bun db:push` for iterating locally (applies the diff directly, no migration files). Schema lives in `apps/server/prisma/schema/*.prisma` (split per domain: `auth`, `room`, `message`) plus `prisma/base.prisma` (generator + datasource). Auth is **better-auth** on a self-hosted Postgres — the `user`/`session`/`account`/`verification` tables live in `auth.prisma` and are fully owned by Prisma (no introspected Supabase schema anymore). Profile fields (displayName, avatarUrl, bannerColor, bio, verified) live in a separate `Profile` table (1-1 FK to `user`), auto-created by a better-auth `databaseHook` on signup. File uploads (avatars, chat attachments) are written to the `UPLOADS_DIR` folder on disk by the server (`lib/uploads.ts`) and served back under `/uploads`.

## Working with the user

- **Language**: respond in Russian. Code, identifiers, commit messages, and quoted error strings stay in their original language (usually English).
- **Docs are English**: every `.md` in the repo — `CLAUDE.md` files, `docs/`, `.claude/rules/`, READMEs — is written in English, as are comments in config files. The two exceptions are `docs/rustore/listing.md` and the quoted store requirements in `docs/rustore/moderation.md`: that text is submitted verbatim to RuStore, so translating it would break the store entry.
- **No code comments in application code**: no `//`, block or JSDoc comments in `views/`, `widgets/`, `features/`, `entities/` (client) or `modules/` (server). Code is self-documenting via clear naming; if a block needs a comment, extract it into a named function. **Narrow exception** — the public surface of reusable modules (`ui-kit`, `shared/lib`, `shared/hooks`, server `src/lib/`, `packages/schemas`): an **exported** primitive may carry a 1–2 line JSDoc when the signature doesn't explain the purpose (non-obvious units, side effect, edge-case behaviour). Internal helpers are never documented. Details and examples — [docs/guides/style.md](docs/guides/style.md) §18. Add other comments only when the user explicitly asks. Leave pre-existing comments in files you didn't author unless told to clean them.
- **No git operations on your own**: never `git commit` / `branch` / `push` unless the user explicitly asks in that message. Stage (`git add`) at most. A task instruction like "go do X" is NOT a commit request.
- **Measure before swapping for perf**: if a performance symptom persists across two implementation swaps, the cause is almost certainly not the library — stop swapping. First do ONE of: repeat the action (fast 2nd time = first-mount/dev-compile, not the lib), test a prod build (`bun run build && bun run start`), or read a DevTools Performance profile. Only swap a library once a profile implicates its code.

## Workflow

- **Verification**: `bun run verify` — one command for everything (typecheck across 3 packages, ESLint, Prettier, Stylelint). Its counterpart is `bun run fix`. Run `verify` before committing.
- **Type checking**: `bun typecheck` from the root runs all workspaces; `bun --filter @chatovo/client typecheck` for one.
- **Lint**: `bun lint:fix` runs ESLint (`@siberiacancode/eslint`); it also sorts imports. Formatting is separate — `bun format` (Prettier, `@siberiacancode/prettier`). Don't fix style by hand and don't argue with the output.
- **Lint SCSS**: `bun lint:css:fix` runs Stylelint (`@siberiacancode/stylelint`, property order from `stylelint-config-idiomatic-order`). Config — [stylelint.config.mjs](stylelint.config.mjs). All linters are wired into pre-commit through lint-staged.
- **Shared versions live in the catalog**: `workspaces.catalog` in the root [package.json](package.json) is the single source of truth for react, zod, typescript, remeda, ts-pattern, date-fns, better-auth. In packages write `"zod": "catalog:"`, not a version.
- **Tests**: `bun run test` — one Vitest run across the whole monorepo. The root [vitest.config.ts](vitest.config.ts) wires three projects (`schemas`, `server`, `client`) via `test.projects`; each workspace has its own config with a `name` and its environment. Tests live in a `_tests/` folder next to the file under test: `foo.ts` → `_tests/foo.test.ts`. Client tests run in jsdom with `@testing-library/react` (setup — [apps/client/vitest.setup.ts](apps/client/vitest.setup.ts) mocks `next/navigation`); server tests get a dummy env from their config, without which Zod env validation fails as soon as the Prisma chain is imported. E2E — Playwright, `bun run test:e2e`, specs in [e2e/](e2e/), two projects (desktop + mobile), the config starts the client dev server itself. Coverage — `bun run test:coverage`. CI (`release.yml`, job `checks`) runs `bun run test`; e2e is not included.
- **Commits**: Conventional Commits, enforced by commitlint through the husky `commit-msg` hook ([commitlint.config.mjs](commitlint.config.mjs)). Subject up to 120 chars, scope is free-form (`client`, `server`, `tauri`, a domain or a file).
- **Branches**: feature branches off `master`. PRs target `master`.

## Things to avoid (repo-wide)

- **No emojis in code** unless explicitly requested.
- **Don't put business logic in `shared/`** (client) — it's project-agnostic; domain hooks/types belong in `features/` or `entities/`.
- **Don't bundle Tauri APIs unconditionally** — gate with `isTauri()` so the web build keeps working.

App-specific "don'ts" (route files server-side, no deep imports past barrels, don't edit generated `messages.d.ts`, etc.) live in the per-app `CLAUDE.md` files above.
