# CLAUDE.md — apps/client

Guidance for Claude Code when working in the web client. Extends the root [../../CLAUDE.md](../../CLAUDE.md); root rules still apply.

Web client — **Next.js 16 / React 19**, App Router. Also the UI loaded by the Tauri desktop shell ([apps/tauri](../tauri/)).

Architecture is **Feature-Sliced Design** with two local tweaks (`pages` → `views`, slices grouped by business domain). Read these before structural changes:

- **[../../docs/fsd.md](../../docs/fsd.md)** — layers, import direction, public-API rules
- **[../../docs/style.md](../../docs/style.md)** — naming, segments, import order (FULL version: examples + reasoning)
- **[../../CLAUDE.md](../../CLAUDE.md)** — repo-wide guidance, reuse-first rules

Компактная выжимка кодстайла — [../../.claude/rules/code-style-client.md](../../.claude/rules/code-style-client.md) (+ общий [code-style.md](../../.claude/rules/code-style.md)); она подгружается автоматически при редактировании файлов `apps/client`. Полная версия — `docs/style.md`; правило меняется в обоих местах.

## Layer map

```
app/        # Next.js routes (thin server wrappers) + providers/. No 'use client' in page/layout.
views/      # whole screens per route (canon FSD: pages/) — auth, error, landing, legal, lobby, not-found, reset-password, room
widgets/    # large composable UI blocks, grouped by domain: app/, chat/, layout/, room/, social/
features/   # user interactions w/ business value, by domain: app/, auth/, room/, social/
entities/   # base domain concepts, by domain: app/, auth/, room/, social/
shared/     # project-agnostic: api/ config/ constants/ hooks/ i18n/ lib/ seo/ styles/ ui/
```

Import direction (downward only): `app → views → widgets → features → entities → shared`.
A **widget importing a feature is correct** (it composes them) — only Feature→Widget / Entity→up are violations.

## Conventions that bite

- **Public API**: import to the slice (`@/features/auth/sign-in`), never the domain group (`@/features/auth`) or deep past the barrel.
- **`shared/ui`**: import from the single root barrel `@/shared/ui`, not per-primitive. Each primitive lives in its own PascalCase folder (see [../../docs/style.md](../../docs/style.md) §2.1).
- **SCSS shared imports**: `@use '@/shared/styles/mixins' as *` — без относительных `../../../` (`sassOptions.loadPaths` + `turbopack.resolveAlias` в `next.config.ts`).
- **`model/` barrels** live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts`.
- **No per-component barrels.** A slice's root `index.ts` is its public API and stays. Inside `ui/components/` and `ui/controllers/`, the aggregating `components/index.ts` points straight at the file (`export { X } from './X/X'`) — don't add an `X/index.ts` that only re-exports its neighbour.
- **Settings state** (`useAppSettings`, settings types) lives in `entities/app/settings` — NOT the `widgets/app/app-settings` widget (which is UI-only).
- **Shared Zod schemas** come from `@chatovo/schemas` ([../../packages/schemas](../../packages/schemas)); auth/profile/room schemas live there, not inline.
- **i18n**: `useTranslations` in client components, `getTranslations` from `next-intl/server` in server components (see `views/landing`). Keys in locale JSON under `shared/i18n/locales/`. Don't edit generated `messages.d.ts`.
- Alias `@/*` → `apps/client/*`.

## Base UI gotchas

UI-примитивы в `shared/ui` построены на **`@base-ui/react`** (миграция с react-aria-components завершена; `react-aria` / `react-aria-components` больше не в зависимостях). Импорт — всегда из подпути: `import { Menu } from '@base-ui/react/menu'`, не из корня пакета.

- **Имя пакета**: в v1.0.0 пакет переехал из орг-скоупа `@base-ui-components/react` в **`@base-ui/react`** (единственный breaking change релиза, CHANGELOG v1.0.0). Старое имя больше не ставится и не резолвится — если встретил его в коде или доке, это устаревший след.

- **State attributes**: Base UI ставит `data-popup-open` (открытый оверлей — и на триггере, и на popup), `data-highlighted` (активный пункт меню), `data-checked`, `data-disabled`, `data-placeholder`. Селекторы из RAC (`data-selected`, `data-hovered`, `data-pressed`) и из Radix (`data-state='open'`) молча не срабатывают. Стиль «меню открыто» — `&[data-popup-open]`, hover-пункт меню — `&[data-highlighted]`.
- **`render`, а не `asChild` / `Pressable`**: чтобы триггер отрендерился твоим компонентом, передавай элемент в `render`: `<Menu.Trigger render={<Button {...props} />} />` (см. `DropdownMenu`, `Dialog`). Никаких оберток-`Pressable` — их в кодовой базе больше нет.
- **`onClick` работает**: `shared/ui` `Button` — обычный нативный `<button>` (или `<a>` при `href`), моста `onPress`/`ButtonContext` больше нет. Нативный элемент можно спокойно класть в `render` любого триггера.
- **Анимация оверлеев**: два рабочих подхода. (1) **CSS** — Base UI сам держит узел в DOM на время выхода и ставит `data-starting-style` / `data-ending-style`; enter/exit пиши как `&[data-starting-style] { animation: … }` (см. `Dialog.module.scss`). (2) **motion** — как в `Sheet`: `<Dialog.Portal keepMounted>` + `AnimatePresence` вокруг содержимого, а `motion.div` подставляется через проп `render` у `Dialog.Backdrop` / `Dialog.Popup`, чтобы focus-trap и a11y остались за библиотекой. Ключевое: при motion выходом управляет `AnimatePresence`, поэтому портал обязан быть `keepMounted`, а `data-starting-style` / `data-ending-style` в стилях не используются — иначе анимации подерутся за момент размонтирования.
- **Закрытие по outside-press с вложенным оверлеем**: `onOpenChange` во втором аргументе получает `eventDetails` с `reason` (`'outside-press'`, `'escape-key'`, `'trigger-press'`, `'close-press'`, `'focus-out'`, …), методом `cancel()` и флагом `isCanceled` (полный список причин — `internals/reason-parts.d.ts` в пакете). Сейчас **ни один компонент в `shared/ui` этим не пользуется**: хелпер `shouldKeepDialogOpen` и `shared/lib/nested-overlay.ts` удалены, `Sheet`/`Dialog` прокидывают `onOpenChange` как `(open: boolean) => void`. Если вложенный оверлей снова начнёт закрывать родительский Dialog — гаси точечно через `eventDetails.reason === 'outside-press'` + `eventDetails.cancel()`, второй аргумент для этого никуда не делся.
- **Select**: `onValueChange` отдаёт `unknown`; `BaseSelect.Value` принимает children-функцию `(selected) => …` для рендера выбранного. `data-placeholder` на триггере проставляется вручную (см. `Select.tsx`), автоматически его нет.
- **Нативные `<button>` без своих стилей**: глобальный reset в `globals.scss` убирает UA-фон; `cursor: pointer` тоже задаётся глобально по ролям.

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
