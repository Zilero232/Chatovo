---
paths:
  - "apps/client/**/*.{ts,tsx}"
---

<!-- COMPRESSED editing-версия: автозагружается при правке файлов apps/client (paths-фронтматтер). -->
<!-- Полная версия с примерами и обоснованиями — docs/guides/style.md; архитектура слоёв — docs/architecture/fsd.md. Держи в синхроне при изменении правила. -->

# Code Style — client (Next.js 16 / React 19, FSD)

Расширяет общий `code-style.md`. Архитектура слоёв — `docs/architecture/fsd.md`, локальные конвенции — `apps/client/CLAUDE.md`.

## 1. Структура слайса

Сегменты: `ui/` `model/` `lib/` `api/` `config/` + `index.ts` (public API). Минимум — `ui/` + `index.ts`.

Главный компонент плоско в `ui/`, файлы рядом: `VoiceRoom.tsx`, `VoiceRoom.types.ts`, `VoiceRoom.module.scss`. Подкомпоненты — в `ui/components/<Name>/` c агрегирующим `components/index.ts`, который указывает прямо на файл (`export { X } from './X/X'`) — **без** per-component `index.ts`.

Родитель импортирует через barrel `./components`, не `./components/ChannelsHeader`.

`ui-kit` — дизайн-система (`primitives/` `components/` `icons/` `styles/`), каждый компонент в PascalCase-папке со своим `index.ts`. Снаружи — только `@/ui-kit`, внутри — относительные.

## 2. Naming

| Что | Как |
|---|---|
| Слайсы, сегменты, файлы хуков/утилит | kebab-case (`voice-room`, `use-room-state.ts`) |
| Папка и файл компонента | PascalCase (`VoiceRoom/VoiceRoom.tsx`) |
| Типы | `<Name>Props`, `<Name>.types.ts`, `Use<Name>Input`, DTO `<Name>Input/Output` |
| Хук / утилита (export) | `useEnterRoom` / `groupMessages` |

Отклонение от канона FSD (там kebab-case везде) — осознанное.

## 3. Размер компонента

**100 строк JSX-файла максимум.** Перевалил: подкомпоненты → `components/`, логика → `model/` (хук), утилиты → `lib/`.

Barrel родственных примитивов (`Dialog`, `Sheet`, `DropdownMenu` на 8–15 экспортов) — не исключение: каждая часть в `components/<Name>/`, `<Name>.tsx` — тонкий реэкспорт. Группируй по смыслу (`Header`/`Footer`/`Title` вместе), а не «файл на экспорт». Общий контекст частей — отдельным модулем рядом (`dialog-overlay-context.ts`), иначе цикл импортов.

Побочный эффект без разметки — headless-контроллер в `ui/controllers/`, рендерит `null`, собирается в фрагмент-оркестратор. Куча `useEffect` в главном компоненте — запрещена.

## 4. Порядок полей Props

Один порядок в трёх местах: `type Props` ↔ деструктуризация ↔ JSX-вызов. Группы: **данные** (включая `children`) → **идентификаторы/стили** (`id`, `className`, `style`) → **обработчики** (`on<Event>`). Расхождение между тремя местами ловится на ревью.

## 5. Порядок хуков

ESLint не сортирует — руками. Группы, пустая строка между:

1. Navigation (`useRouter`, `useSearchParams`)
2. Store / context (`useCurrentUser`, `use<Name>Store`)
3. Data (TanStack Query/Mutation)
4. State (`useState`, `useReducer`)
5. Ref
6. Memo / callbacks (`useMemo`, `useCallback`, `useTransition`, `useId`)
7. Effects
8. Derived const

Кастомные хуки — по семантике содержимого (`useRooms` делает `useQuery` → группа Data). Хук с data dependency не переставляем: если `name` нужен `useRoomToken({ roomName: name })`, `name` идёт раньше. `if (...) useFoo()` — баг `rules-of-hooks`, чинить, не сортировать.

## 6. Effects и deps

В `deps` — только то, что **должно триггерить перезапуск**. Стабильные ref (`router`, `mutate`/`reset` из react-query) в deps не идут; `eslint-disable-next-line react/exhaustive-deps -- причина` с явной причиной — нормальная практика.

```tsx
// eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on roomId change; router is a stable ref
useEffect(() => {
  if (!roomId) router.replace(ROUTES.lobby);
}, [roomId]);

// ✗ }, [roomId, room, router, tokenMutation]); — объект мутации меняет ref каждый рендер
```

**Антипаттерн: `useEffect` + `mutate` для загрузки данных** → рефетч-циклы. Декларативная загрузка — `useQuery` с ключом (`queryKey: [roomId]`), react-query сам рефетчит при смене ключа.

Свежий колбэк внутри эффекта без перезапуска эффекта — `useEffectEvent`, не ручной `cbRef.current = cb`.

## 7. Деструктуризация query / mutation

`useQuery` деструктурируем сразу, `data` переименовываем под смысл. `useMutation` оставляем цельным объектом — нужны и поля, и методы.

```tsx
const { data: room, isLoading } = useRoomById(roomId);
const tokenMutation = useRoomTokenMutation(); // ✓ mutation — объект

// ✗ const roomById = useRoomById(roomId); const room = roomById.data;
```

## 8. Conditional render — ts-pattern

3+ ветки → `match` (на discriminated union из хука либо прямо на объекте сырых хуков с `P.nullish` / `P.nonNullable`). `.exhaustive()` обязателен. Порядок `.with` важен — первый совпавший выигрывает; узкие значения бери из аргумента хендлера, не из замыкания и не через `as`.

```tsx
// ✗ condition hell в view
return !roomId ? null : isLoading ? <Loading /> : !room ? <NotFound /> : <Room />;
```

**Одна ветка — `&&`, не `? : null`.** Условие обязано быть boolean: `&&` рендерит левый операнд как есть, `0` / `''` попадут в разметку.

```tsx
{isAdmin && <Badge />}
{participants.length > 0 && <List />}

// ✗ {participants.length && <List />} — отрендерит "0" на пустом массиве
// ✗ {isAdmin ? <Badge /> : null}
```

Тернарник — для двух реальных веток.

## 9. Сегменты model / lib / api

**`model/`** — хуки, стор, контексты, типы стейта. Подсистема (Provider + context + хук) → своя папка с `index.ts`. Группировка внутри: `model/hooks/`, `model/contexts/`, `model/stores/` — у каждой свой barrel. **Slice-level `model/index.ts` НЕ создаём**; импорт снаружи — через barrel подпапки, внутри подпапки — по файлу.

Локальные типы одного хука — в том же файле. Публичные типы слайса — `model/types.ts` (это файл, импортируется напрямую). Отдельные сегменты `types/` и `hooks/` на верхнем уровне слайса — антипаттерн FSD.

**`lib/`** — чистые функции без React. Возвращает JSX → это компонент, в `ui/`. Использует React → `model/`. Константы → `config/`.

**`api/`** — I/O-граница (подписки, мапперы, обёртки сервиса). Слушает/шлёт во внешний сервис → `api/`; читает/выводит доменный стейт → `model/`.

HTTP — только общий axios-инстанс из `shared/api/http` (он вешает `Authorization` и разворачивает `{ error }` в `Error`). Ручной `fetch` / свой `axios.create` запрещены. Типы запроса/ответа — из `@chatovo/schemas`.

## 10. Стили

Только SCSS modules (`*.module.scss`), CSS-in-JS запрещён. Токены — CSS-переменные в `app/globals.scss` + `ui-kit/styles/_tokens.scss`. Общие миксины — `@use '@/ui-kit/styles/mixins' as *`, без `../../../`. Склейка классов — `clsx` напрямую, без обёртки `cn()`. Условные варианты — maps в TSX или `cva`.

Анимации появления/исчезновения и layout-переходы — `motion`; в CSS остаются hover/focus, бесконечные лупы и декоративный фон.

## 11. Формы

`react-hook-form` + `zodResolver`, схема из `@chatovo/schemas/<resource>` (не inline). `useState` для полей формы запрещён. Server-side ошибки — `setError('field', { message })`. Boolean-тоглы вне формы — `useBoolean` из reactuse.

## 12. Drill cleanup

Данные доступны через глобальный хук — leaf берёт сам, не принимает props. Не делай параметризацию для статичного контента (`<RoomLoader text="Loading room..." />` → `<RoomLoadingFallback />`).

Props оставляем: данные из `.map`, UI state оркестратора, колбэк требует контекст родителя.

## 13. React-конвенции

Функциональные компоненты, arrow-функции. `'use client'` в каждом файле с хуками/state/handlers. React Compiler включён — `useMemo`/`useCallback` только для семантически стабильного ref. Типы React — именованные импорты (`import type { ReactNode } from 'react'`), `import type * as React` запрещён. Обработчики — `on<Event>` camelCase.
