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

## Base UI gotchas

UI-примитивы в `shared/ui` построены на **`@base-ui-components/react`** (миграция с react-aria-components завершена; `react-aria` / `react-aria-components` больше не в зависимостях). Импорт — всегда из подпути: `import { Menu } from '@base-ui-components/react/menu'`, не из корня пакета.

- **State attributes**: Base UI ставит `data-popup-open` (открытый оверлей — и на триггере, и на popup), `data-highlighted` (активный пункт меню), `data-checked`, `data-disabled`, `data-placeholder`. Селекторы из RAC (`data-selected`, `data-hovered`, `data-pressed`) и из Radix (`data-state='open'`) молча не срабатывают. Стиль «меню открыто» — `&[data-popup-open]`, hover-пункт меню — `&[data-highlighted]`.
- **`render`, а не `asChild` / `Pressable`**: чтобы триггер отрендерился твоим компонентом, передавай элемент в `render`: `<Menu.Trigger render={<Button {...props} />} />` (см. `DropdownMenu`, `Dialog`). Никаких оберток-`Pressable` — их в кодовой базе больше нет.
- **`onClick` работает**: `shared/ui` `Button` — обычный нативный `<button>` (или `<a>` при `href`), моста `onPress`/`ButtonContext` больше нет. Нативный элемент можно спокойно класть в `render` любого триггера.
- **Анимация оверлеев — CSS, не motion**: Base UI сам держит узел в DOM на время выхода и ставит `data-starting-style` / `data-ending-style`. Enter/exit пиши как `&[data-starting-style] { animation: … }` / `&[data-ending-style] { animation: … }` (см. `Dialog.module.scss`). Это исключение из репо-правила «enter/exit только через motion» — здесь атрибуты ставит библиотека, и CSS на них реагирует корректно.
- **Закрытие по outside-press с вложенным оверлеем**: `onOpenChange` во втором аргументе получает `eventDetails` с `reason` (`'outside-press'`, `'escape-key'`, …) и методом `cancel()`. Клик по вложенному меню/попоуверу иначе закрывает родительский Dialog — гаси через `shouldKeepDialogOpen(eventDetails.event?.target)` из [shared/lib/nested-overlay.ts](shared/lib/nested-overlay.ts) + `eventDetails.cancel()` (см. `Sheet`). Хелпер ищет вложенные оверлеи по `data-slot`, поэтому **не снимай `data-slot` с popup-компонентов** — это его контракт.
- **Select**: `onValueChange` отдаёт `unknown`; `BaseSelect.Value` принимает children-функцию `(selected) => …` для рендера выбранного. `data-placeholder` на триггере проставляется вручную (см. `Select.tsx`), автоматически его нет.
- **Нативные `<button>` без своих стилей**: глобальный reset в `globals.scss` убирает UA-фон; `cursor: pointer` тоже задаётся глобально по ролям.

## Commands

```bash
bun dev:client                 # from repo root
cd apps/client && bun x tsc --noEmit   # typecheck (no script)
bun lint:fix                   # Biome (from root) — sorts imports/exports
```
