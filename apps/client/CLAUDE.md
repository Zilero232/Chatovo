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

## react-aria-components gotchas

- **State attributes**: RAC ставит `data-selected` / `data-disabled` / `data-hovered` / `data-pressed`. Radix-селекторы `[data-active]`, `[data-checked]`, `[data-state='open']` и `:disabled` на RAC-компонентах молча не срабатывают.
- **Открытый оверлей**: RAC не ставит `data-state="open"` — на триггере появляется `aria-expanded="true"`. Стили «меню открыто» пиши через `&[aria-expanded='true']`, а для обёртки вокруг триггера — `&:has([aria-expanded='true'])`.
- **`onPress`, не `onClick`**: RAC-компоненты игнорируют `onClick`. `shared/ui` `Button` принимает `onClick` (без event-аргумента) и мостит его в `onPress`; мост подключается только когда обработчик передан — иначе он перекрыл бы `onPress`, который `MenuTrigger`/`DialogTrigger` инжектят через `ButtonContext` (локальный проп побеждает контекстный).
- **Прямые дети `Menu`**: только collection-элементы (`MenuItem`, `MenuSection`, `Header`, `Separator`). Сырой `div`/`svg` прямым ребёнком рендерится в fake-DOM коллекции и падает с `createElementNS is not a function` при открытии. Заголовки — через `DropdownMenuLabel`. SVG **внутри** `MenuItem` безопасен.
- **Нативный элемент как триггер оверлея**: `DialogTrigger`/`MenuTrigger` вешают обработчик через `ButtonContext`, нативный `<button>` его не получает. Оборачивай в `Pressable` (см. `ProfileCardTrigger`).
- **Нативные `<button>` без своих стилей**: глобальный reset в `globals.scss` убирает UA-фон; `cursor: pointer` тоже задаётся глобально по ролям.
- **`PressResponder` warning**: `A PressResponder was rendered without a pressable child` кидают только `DialogTrigger`/`MenuTrigger`/`FileTrigger` (Tooltip — нет, он на `FocusableProvider`). Значит нативный элемент лежит прямым ребёнком `Dialog`/`Sheet`/`Popover`/`DropdownMenu` — оборачивай в `Pressable` (см. `BannerColorField`).
- **Анимация RAC-оверлеев через motion**: RAC сам решает, когда размонтировать оверлей (`useExitAnimation` внутри `ModalOverlay`), поэтому наивная замена CSS→motion убивает exit-анимацию. Рабочий паттерн (Adobe-канон, см. `Sheet`): `motion.create(ModalOverlay)` + стейт `'unmounted' | 'hidden' | 'visible'` + проп `isExiting={animation === 'hidden'}` — он держит узел в DOM, пока motion доигрывает; `onAnimationComplete` возвращает стейт в `unmounted`. `AnimatePresence` для оверлеев Adobe не рекомендует.

## Commands

```bash
bun dev:client                 # from repo root
cd apps/client && bun x tsc --noEmit   # typecheck (no script)
bun lint:fix                   # Biome (from root) — sorts imports/exports
```
