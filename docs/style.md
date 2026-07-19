# Chatovo Style Guide

Проектные кодстайл-конвенции для `apps/client/`. Архитектурные правила — в [`docs/fsd.md`](./fsd.md).

Инструменты:

- **Biome** (`bun lint` / `bun lint:fix`) — форматтер + линтер + organize imports. Конфиг: корневой `biome.json`.
- **TypeScript** strict + `noUnusedLocals` + `noUnusedParameters`.
- FSD-границы и ряд React-конвенций держим руками + ловим на review (Biome не покрывает: порядок хуков, `padding-line-between-statements`, FSD cross-slice imports).

**Почему Biome:** один инструмент вместо ESLint+Prettier, на порядок быстрее, один конфиг без плагин-зоопарка. `useExhaustiveDependencies` закрыт; сортировка Tailwind-классов больше не актуальна (стили → SCSS modules).

---

## 1. Структура слайса

Каждый слайс — папка с сегментами. Минимум — `ui/` + `index.ts`:

```
widgets/voice-room/
  index.ts          ← public API (barrel)
  ui/               ← React-компоненты
  model/            ← хуки, Zustand store, типы стейта
  lib/              ← чистые утилиты слайса
  api/              ← I/O-граница: подписки, мапперы, сервис-обёртки (если есть)
  config/           ← константы, конфиг
```

---

## 2. Структура `ui/` слайса

**Главный компонент** живёт плоско в `ui/`, файлы рядом:

```
widgets/voice-room/ui/
  VoiceRoom.tsx          ← JSX + entry-компонент
  VoiceRoom.types.ts     ← Props и локальные union-типы
  VoiceRoom.module.scss  ← стили компонента
```

**Подкомпоненты** (используются только внутри родителя) — каждый в папке `components/`:

```
widgets/channels-panel/ui/
  ChannelsPanel.tsx
  ChannelsPanel.module.scss
  components/
    index.ts                   ← barrel: re-exports всех подкомпонентов
    ChannelsHeader/
      ChannelsHeader.tsx
      ChannelsHeader.types.ts
      ChannelsHeader.module.scss
      index.ts                 ← `export { ChannelsHeader } from './ChannelsHeader';`
    ChannelsList/
      ...
```

Родитель импортирует через barrel:

```ts
// ✓ ОК
import { ChannelsHeader, ChannelsList } from './components';

// ✗ НЕ ОК
import { ChannelsHeader } from './components/ChannelsHeader';
```

**Правила файлов:**

- `.types.ts` — создаётся только если есть Props или локальные union-типы.
- `.module.scss` — стили компонента (импорт `import s from './Foo.module.scss'`). Обязательно на всех слоях.
- `shared/ui/` — атомарный слой (atoms/molecules/organisms/icons). **Не плоские `button.tsx`** — каждый примитив в PascalCase-папке (§2.1). Снаружи — `@/shared/ui`.

### 2.1. Структура `shared/ui`

Каждый примитив — отдельная папка в PascalCase.

```
shared/ui/
  index.ts                    ← re-export atoms + molecules + organisms + icons
  atoms/
    index.ts                  ← re-export всех atoms
    Button/
      Button.tsx
      Button.module.scss
      Button.types.ts         ← опционально
      index.ts                ← export * from './Button'; export type * from './Button.types';
    Dialog/
      Dialog.tsx
      Dialog.module.scss
      Dialog.types.ts
      index.ts
  molecules/
    FormField/
      FormField.tsx
      FormField.module.scss
      index.ts
  organisms/
    ConfirmDialog/
      ...
  icons/
    LogoMark/
      LogoMark.tsx
      index.ts
```

**Правила:**

- Имена папок и файлов компонентов — **PascalCase** (`Button/`, `Button.tsx`).
- Стили — **`*.module.scss`**; импорт shared-утилит: `@use '@/shared/styles/mixins' as *` (alias `@/` через `loadPaths` + `turbopack.resolveAlias` в `next.config.ts`, без `../../../`).
- Headless + a11y — **`@base-ui-components/react`** (Dialog → `Dialog`, Menu → `Menu`, Select → `Select`, …); импорт из подпути пакета.
- Типы React — **именованные** (`ComponentProps`, `ReactNode`, …), не `import type * as React`.
- Внутри `shared/ui` — относительные импорты между слоями (`../../atoms/Button`). Снаружи — только `@/shared/ui`.

### Slice barrel

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

### Headless-контроллеры (`ui/controllers/`)

Сайд-эффект без разметки — компонент, который рендерит `null` и инкапсулирует один эффект (sync mic-state, sync tray, sounds, shortcuts). Каждый — папка в `ui/controllers/`, собираются в один фрагмент-оркестратор:

```tsx
// ui/controllers/RoomControllers/RoomControllers.tsx
export const RoomControllers = ({ roomId }: RoomControllersProps) => (
  <>
    <RoomDeviceController />
    <MicStateController roomId={roomId} />
    <RoomSoundsController />
  </>
);
```

Так эффекты не раздувают тело главного компонента, каждый изолирован и тестируется отдельно. Альтернатива «куча `useEffect` в `VoiceRoom.tsx`» — запрещена (превышает лимит 100 строк, секция 4).

### Примеры

**`VoiceRoom.types.ts`:**

```ts
import type { DisconnectReason } from 'livekit-client';

export type VoiceRoomProps = {
  roomName: string;
  serverUrl: string;
  token: string;
  onConnectFailure: (reason: DisconnectReason) => void;
  onLeave: () => void;
};
```

**`VoiceRoom.module.scss`:**

```scss
@use '@/shared/styles/mixins' as *;

.root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--glass-border);
}
```

Варианты с условиями — `cva` из `class-variance-authority` поверх module-классов (см. `shared/ui/atoms/Text/Text.variants.ts`).

**`VoiceRoom.tsx`:**

```tsx
'use client';

import s from './VoiceRoom.module.scss';
import type { VoiceRoomProps } from './VoiceRoom.types';

export const VoiceRoom = ({ token, serverUrl }: VoiceRoomProps) => (
  <div className={s.root}>
    <div className={s.header}>{/* ... */}</div>
  </div>
);
```

---

### 2.2. Структура `model/hooks`

Симметрично `ui/`: **хук со своими типами — в собственной папке**, плоский файл только если типов нет.

```
features/social/friend-chat/model/hooks/
  index.ts                          ← barrel слайса
  use-friend-chat-session/
    use-friend-chat-session.ts      ← хук без типов — папка не обязательна,
    index.ts                           но единообразие внутри слайса важнее
  use-friend-chat-unread/
    use-friend-chat-unread.ts
    use-friend-chat-unread.types.ts ← есть Input/Output-тип → папка обязательна
    index.ts
```

`index.ts` хука реэкспортит и хук, и типы:

```ts
export { useFriendChatUnread } from './use-friend-chat-unread';

export type * from './use-friend-chat-unread.types';
```

Тип входа хука называется `Use<Name>Input` (§5). Если он повторяет пропсы компонента — не дублируй, а выведи: `Pick<VoiceRoomProps, 'roomId' | 'onLeave'>`.

---

## 3. Стили: SCSS modules

| Слой | Формат |
|---|---|
| `shared/ui/**` | `*.module.scss` + CSS-переменные из `globals.scss` |
| widgets / features / views | `*.module.scss` |

| Случай | Куда |
|---|---|
| Стили компонента в `shared/ui` | `<Name>.module.scss` |
| Стили подкомпонента слайса | `<Name>.module.scss` |
| Склейка module-классов и опционального `className` prop | `clsx(...)` |
| Условные классы | maps в TSX (`variantClass[variant]`) или SCSS-модификаторы |

Принцип — JSX читается, `s.root`/`s.header` рассказывают структуру.

---

## 4. Размер компонента

**100 строк JSX-файла максимум.**

Перевалил — рефактор:

1. Подкомпоненты → `components/`.
2. Логика → `model/` (хук).
3. Утилиты → `lib/` слайса.

**Barrel родственных примитивов — тоже не исключение.** `shared/ui` компоненты вида `Dialog`/`Sheet`/`DropdownMenu` экспортируют 8–15 мелких частей (`Dialog`, `DialogContent`, `DialogHeader`, …). Держать их одним файлом нельзя: каждая часть — в `components/<Name>/`, а `<Name>.tsx` остаётся тонким реэкспортом.

```
shared/ui/atoms/Dialog/
  Dialog.tsx                  ← только `export { ... } from './components'`
  Dialog.types.ts
  Dialog.module.scss
  dialog-overlay-context.ts   ← общий контекст (иначе цикл импортов)
  components/
    index.ts
    DialogRoot/DialogRoot.tsx
    DialogContent/DialogContent.tsx
    DialogHeader/DialogHeader.tsx   ← Header + Footer + Title + Description
    DialogClose/DialogClose.tsx     ← Close + Portal + Overlay
```

Группируй по смыслу, а не «файл на экспорт»: близкие части (`Header`/`Footer`/`Title`/`Description`) живут вместе.

**Контекст, который шарят части, — отдельным модулем** рядом с `<Name>.tsx` (`dialog-overlay-context.ts`), не внутри компонента: иначе `components/*` импортируют родителя, а родитель — их. Общий для нескольких примитивов контекст — в `shared/ui/lib/` (`menu-radio-group-context.ts`).

---

## 5. Naming

| Что | Как | Пример |
|---|---|---|
| Слайсы | kebab-case | `voice-room`, `channels-panel` |
| Сегменты | kebab-case | `ui`, `model`, `lib`, `api`, `config` |
| Папка компонента | PascalCase | `VoiceRoom/`, `ChannelsFooter/` |
| Файл компонента | PascalCase + `.tsx` | `VoiceRoom.tsx` |
| Файл типов | `<Name>.types.ts` | `VoiceRoom.types.ts` |
| Файл стилей | `<Name>.module.scss` | `Button.module.scss` |
| Файл хука | kebab-case | `use-room-state.ts` |
| React-компонент (export) | PascalCase | `VoiceRoom` |
| Хук | `use` + camelCase | `useEnterRoom`, `useRoomState` |
| Утилита | camelCase | `groupMessages`, `formatTime` |
| Тип Props | `<Name>Props` | `VoiceRoomProps` |
| DTO тип | `<Name>Input/Output` | `EnterRoomInput` |

> Канон FSD: kebab-case для всех файлов. Chatovo отклонение: PascalCase для папок и файлов компонентов, kebab-case для хуков/утилит.

---

## 6. Импорты

### Алиасы

`@/` → корень `apps/client/`. Используем для всего кроме относительных в той же папке.

### Порядок групп

Biome organize-imports (`bun lint:fix`) сортирует на 4 группы в этом порядке, **с пустой строкой между группами** (`:BLANK_LINE:` в `biome.json`):

1. **Внешние value-импорты** — пакеты, `node:`-builtins, `@chatovo/*`.
2. **Локальные value-импорты** — `@/`-алиасы и относительные `./` `../`.
3. **Стили** — `*.css` / `*.scss` (`:STYLE:`).
4. **Все типы** — любой `import type`, внешний и локальный вместе.

```ts
// 1. внешние value
import { useForm } from 'react-hook-form';

// 2. локальные value
import { useCurrentUser } from '@/entities/auth/user';
import { groupMessages } from '../lib/grouping';

// 3. стили
import s from './VoiceRoom.module.scss';

// 4. типы (внешние + локальные)
import type { Room } from '@chatovo/schemas/rooms';
import type { VoiceRoomProps } from './VoiceRoom.types';
```

Конфигурация — `assist.actions.source.organizeImports.options.groups` в `biome.json`.
Пустые строки между группами вставляет Biome при `bun lint:fix`; не удаляй их вручную.

### Запреты

Deep import мимо barrel запрещён:

```ts
// ✗ ЗАПРЕЩЕНО
import { ChannelsList } from '@/widgets/room/channels-panel/ui/components/ChannelsList';
import { Button } from '@/shared/ui/atoms/Button';

// ✓ ОК
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { Button } from '@/shared/ui';
```

`shared/ui` — единый корневой barrel `@/shared/ui` (атомарный слой под капотом). Внутри слайса — относительные ОК.

Biome не проверяет FSD-границы — ловим на review.

---

## 7. Barrel-экспорты (`index.ts`)

**Слайс:**

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

Только то, что нужно снаружи. Внутренние подкомпоненты — не экспортируем.

**Папка компонента:**

```ts
// ui/VoiceRoom/index.ts
export { VoiceRoom } from './VoiceRoom';
export type { VoiceRoomProps } from './VoiceRoom.types';
```

**Подсистема в `model/`:** если хук собран из нескольких файлов в подпапке, `index.ts` рядом с ними экспортирует только публичную точку входа — Provider и хук. Внутренние модули и типы наружу не идут.

```ts
// entities/room/model/rooms-presence/index.ts
export { RoomsPresenceProvider, useRoomsPresence } from './rooms-presence-context';
```

Wildcard-экспорты (`export * from`) — запрещены. Только явные именованные.

---

## 8. Типы

- **Всё через `type`** — Props, unions, алиасы, DTO. `interface` запрещён: Biome
  `useConsistentTypeDefinitions: { style: type }` (autofix через `--unsafe`).
- Props всегда в `<Name>.types.ts` рядом с компонентом.
- `import type { ... }` — Biome enforce (`useImportType: error`), `bun lint:fix` чинит сам.
- `export type { ... }` — Biome enforce (`useExportType: error`).
- `unknown` вместо `any`. `any` запрещён (`noExplicitAny: error`).
- Discriminated unions для вариантов состояния:

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number; mime: string };
```

### 8.1 Порядок полей в Props и деструктуризации

Один порядок во всех трёх местах: **`type Props`**, **деструктуризация параметров**, **JSX-вызов компонента**. Так глаз ищет одно и то же одинаково.

Порядок:

1. **Данные** — string, number, boolean, объекты, refs, `children`.
2. **Идентификаторы / стили** — `id`, `className`, `style`.
3. **Обработчики событий** — `onClick`, `onSubmit`, `onChange`, любые `on<Event>`.

```ts
// ✓ ОК
export type UserNameProps = {
  name: string;
  verified?: boolean;
  profileUrl?: string | null;
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
};

export const UserName = ({
  name,
  verified,
  profileUrl,
  size = 'sm',
  className,
  onClick,
}: UserNameProps) => {
  ...
};

// JSX:
<UserName
  name={author}
  profileUrl={profileUrl}
  verified={verified}
  className={s.author}
  onClick={handleClick}
/>
```

Логика: «что показываем» → «как выглядит» → «что делает». Сначала смысл, потом форма, потом поведение.

Внутри каждой группы порядок свободный, но **в трёх местах должен совпадать** (Props ↔ destructuring ↔ JSX). Расхождение ловится на ревью.

---

## 9. Arrow-функции: тело

**Все объявления (top-level и модульные) — block body с `return`.** Однострочные expression body запрещены: вид `=> { return ... }` единообразен независимо от размера тела, не приходится переписывать когда логика растёт.

```ts
// ✓ ОК
const readRole = (user: User | null): UserRole => {
  return user?.app_metadata?.role === 'admin' ? 'admin' : 'user';
};

const resolveDisplayName = (user: User | null): string => {
  return (
    firstNonEmptyString([meta.display_name, meta.full_name, meta.name]) ??
    user?.email?.split('@')[0] ??
    'you'
  );
};

// ✗ НЕ ОК
const readRole = (user: User | null): UserRole =>
  user?.app_metadata?.role === 'admin' ? 'admin' : 'user';
```

**Исключения — оставляем expression body:**

- **React-компоненты, возвращающие JSX напрямую** — JSX сам по себе является «телом», обёртка `{ return }` визуально дублирует:

  ```tsx
  // ✓ ОК
  export const Avatar = ({ src }: Props) => <img src={src} />;

  export const Foo = (props: P) => (
    <div>
      <span>{props.text}</span>
    </div>
  );
  ```

- **Inline-колбэки** (аргументы функций, JSX-пропсы, методы хуков):

  ```ts
  // ✓ ОК — это аргумент, не объявление
  arr.map((x) => x.id);
  arr.filter((x) => x.active);
  pipe(xs, filter((x) => x > 0));
  useEffect(() => setOpen(true), []);
  <Button onClick={() => router.push('/foo')} />
  match(state).with('idle', () => null)
  ```

- **Примитивы в `shared/ui/`** — своя конвенция (PascalCase-папки, SCSS modules, Base UI). См. §2.1.

**Правило для review:** если стрелка справа от `=` (объявление функции) — block body. Если стрелка внутри `(...)` или `{...}` (аргумент) — на усмотрение, обычно expression.

### 9.5 `if` / `else` — всегда с фигурными скобками

**Тело `if`, `else if`, `else` всегда в `{}`, даже на одну строку.** Однострочный `if (cond) doThing();` запрещён: добавление второго стейтмента в ветку не требует переписывать структуру, диффы чище, нет ловушки «забыл скобки». Enforced биомом (`style/useBlockStatements`, `error`) — `bun lint:fix` чинит автоматически.

```ts
// ✓ ОК
if (!isTauri()) {
  return;
}

if (isManual) {
  toast.success(t('upToDate'));
}

// ✗ НЕ ОК
if (!isTauri()) return;
if (isManual) toast.success(t('upToDate'));
```

Тернарник для возврата значения — по-прежнему ОК (это выражение, не стейтмент): `return a ? b : c;`.

---

## 10. React-конвенции

- Функциональные компоненты, arrow-функции.
- `'use client'` в каждом файле с хуками/state/event handlers.
- React Compiler включён — не нужны `useMemo`/`useCallback` для микро-оптимизаций. Оставляем только для семантического stable ref (зависимости `useEffect`, key в Map).
- Обработчики событий — `on<Event>` camelCase: `onSubmit`, `onSelectRoom`.
- Типы из React — **именованные импорты**: `import type { ComponentProps, ReactNode } from 'react'`. **`import type * as React from 'react'` запрещён.**

### 9.1 Порядок хуков

Biome не сортирует хуки — соблюдаем руками + ловим на review.

Порядок групп:

1. **Navigation** — `useRouter`, `usePathname`, `useSearchParams`, `useParams`.
2. **Store / context** — `useCurrentUser`, `useAuthStore`, любые `use<Name>Store`.
3. **Data** — TanStack Query/Mutation хуки.
4. **State** — `useState`, `useReducer`.
5. **Ref** — `useRef`.
6. **Memo / callbacks** — `useMemo`, `useCallback`, `useTransition`, `useId`.
7. **Effects** — `useEffect`, `useLayoutEffect`.
8. **Derived const** — `const x = params.get(...)`, распакованные значения хуков.

Между группами — пустая строка. Внутри группы — без пустой.

```tsx
export const ChannelsPanel = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { user, isAdmin } = useCurrentUser();

  const rooms = useRooms();
  const deleteMutation = useDeleteRoom();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    // ...
  }, [rooms.data]);

  const activeRoom = params.get('name');

  return /* ... */;
};
```

**Правила перестановки:**

- Не переставляй хук с data dependency: если `name` нужен `useRoomToken({ roomName: name })` — `name` обязан быть до хука. Если порядок групп противоречит — оставь как есть, пометь `// data dep: name → query`.
- `if (...) useFoo()` — это баг `rules-of-hooks`, чинить, не сортировать.

**Кастомные хуки** — по семантике содержимого: `useRooms` (делает `useQuery`) → группа Data; `useCurrentUser` (обёртка контекста) → группа Store; `useDocumentTitle` (эффект) → группа Effects.

### 9.2 Зависимости хуков / Effects

`deps`-массив `useEffect` — только то, что **реально должно триггерить перезапуск** эффекта. Знаем что эффекту нужен один `roomId` — не добавляем `room`, `router`, объекты мутаций «чтобы линтер молчал».

**Стабильные ref не идут в deps.** `router` из `next/navigation`, `reset`/`mutate` из react-query стабильны между рендерами. Добавлять их смысла нет — эффект не должен реагировать на их «смену». `// biome-ignore lint/correctness/useExhaustiveDependencies` с явной причиной — нормальная практика, не костыль.

```tsx
// ✗ ПЛОХО — лишние deps, объект мутации меняет ref каждый рендер
useEffect(() => {
  if (!roomId) router.replace(ROUTES.lobby);
}, [roomId, room, router, tokenMutation]);

// ✓ ОК — триггер только roomId, причина зафиксирована
// biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on roomId change; router is a stable ref
useEffect(() => {
  if (!roomId) router.replace(ROUTES.lobby);
}, [roomId]);
```

**Антипаттерн: `useEffect` + `mutate` для загрузки данных.** Объект мутации в deps → новый ref каждый рендер → рефетч-циклы. Декларативную загрузку делать через `useQuery` с ключом (`queryKey: [roomId]`) — react-query сам рефетчит при смене ключа, `useEffect` и `reset()` не нужны.

### 9.3 Деструктуризация результатов query / mutation

Результат `useQuery` / кастомного query-хука **деструктурируем сразу**, не носим объект и не лазаем через точку:

```tsx
// ✗ ПЛОХО — доступ через точку, объект-обёртка не нужен
const roomById = useRoomById(roomId);
const room = roomById.data;
// ... roomById.isLoading, roomById.isError

// ✓ ОК — деструктуризация на месте, переименование под смысл
const { data: room, isLoading } = useRoomById(roomId);
const { data: publicTokenData, isError: publicTokenFailed } = usePublicRoomToken(roomId, enabled);
```

`data` почти всегда переименовываем (`data: room`) — голое `data` не несёт смысла.

**Исключение — `useMutation`.** Объект мутации оставляем цельным: нужны и поля (`isPending`, `isError`, `error`, `data`), и методы (`mutateAsync`, `reset`). Деструктуризация 5+ имён хуже читается, а методы всё равно зовём как `tokenMutation.reset()`.

```tsx
// ✓ ОК — mutation остаётся объектом
const tokenMutation = useRoomTokenMutation();
// ... tokenMutation.isPending, tokenMutation.mutateAsync(...), tokenMutation.reset()
```

### 9.4 Деструктуризация везде, где упрощает

Принцип: **деструктурируй по максимуму** — для читаемости. Если значение используется через точку 2+ раза или приходит вложенным, вытащи его в локальную переменную. Меньше шума `obj.a.b`, имена говорят за себя.

**Вложенный доступ — деструктурируй родителя:**

```ts
// ✗ ПЛОХО — row.sender.X повторяется
senderName: resolveDisplayName({
  displayName: row.sender.profile?.displayName,
  name: row.sender.name,
  email: row.sender.email,
  userId: row.senderId,
});

// ✓ ОК — sender вытащен один раз
const { sender, senderId } = row;
senderName: resolveDisplayName({
  displayName: sender?.profile?.displayName,
  name: sender?.name,
  email: sender?.email,
  userId: senderId,
});
```

**Параметры-функции: 3+ аргумента → один объект с деструктуризацией.** Позиционные аргументы (особенно одного типа — `string, string, string`) легко перепутать местами; объект самодокументирует и порядок не важен.

```ts
// ✗ ПЛОХО — 4 позиционных, легко перепутать
resolveDisplayName(displayName, name, email, userId);

// ✓ ОК — объект-параметр, деструктуризация в сигнатуре
resolveDisplayName({ displayName, name, email, userId });
```

**Повторный `obj.x` (2+) — в локальную переменную / деструктуризацию:**

```ts
// ✗ ПЛОХО
if (file.size === 0) ...;
if (file.size > MAX) ...;
const ext = extension(file.type);

// ✓ ОК
const { size, type, name } = file;
if (size === 0) ...;
if (size > MAX) ...;
const ext = extension(type);
```

**Когда НЕ деструктурировать:**

- Одно обращение — `obj.x` один раз, деструктуризация лишняя церемония.
- Теряется контекст — если `name` без префикса непонятно чьё, оставь `user.name` / переименуй (`const { name: senderName } = ...`).
- Стабильный неймспейс-объект (`router`, `console`, `Math`) — не трогаем.

---

## 11. Сегменты `model/`, `lib/`, `api/`

**`model/`** — хуки, Zustand store, контекст-провайдеры, типы стейта.

```
entities/room/model/
  hooks/                     ← группа хуков
    index.ts                 ← barrel хуков
    use-enter-room.ts
    use-room-token.ts
  rooms-presence/            ← подсистема = папка
    index.ts                 ← barrel: { RoomsPresenceProvider, useRoomsPresence }
    rooms-presence-context.tsx
    use-rooms-presence-stream.ts
  types.ts                   ← публичные типы слайса (если используются снаружи)
  (без model/index.ts — barrel на уровне подпапок)
```

Файлы — kebab-case. Функции внутри — camelCase.

**Подсистема → папка.** Provider + context + хук (либо хук + 2+ модуля только для него) → отдельная папка с `index.ts` (напр. `rooms-presence/`). Хуки/контексты слайса группируются в `model/hooks/`, `model/contexts/` (см. barrel-правило ниже). Совсем плоский `model/` (1-2 файла без подпапок) допустим для мелких слайсов.

**Группировка внутри `model/`.** Когда в слайсе много `model`-файлов, группируй их в подпапки по природе (`model/contexts/`, `model/hooks/`, `model/stores/`, `model/lib/`) — см. `features/room/room-control`, `widgets/chat/chat-panel`. Это организация **внутри** сегмента `model/`, не отдельный top-level сегмент `hooks/` (тот запрещён, см. ниже).

**Barrel-правило `model/`.** У каждой подпапки `model/` — свой `index.ts` (`model/hooks/index.ts`, `model/contexts/index.ts`, `model/stores/index.ts`). **Slice-level `model/index.ts` НЕ создаём.** Импорт снаружи подпапки — через её barrel:

```ts
// ✓ ОК
import { useRoomControls } from '../model/hooks';
import { DeafenProvider } from '../model/contexts';
// slice index.ts
export { useRoomControls } from './model/hooks';

// ✗ НЕ ОК
import { useRoomControls } from '../model/hooks/use-room-controls';  // deep мимо barrel
import { useRoomControls } from '../model';                          // model/index не существует
```

Между файлами **внутри одной подпапки** — относительный импорт по файлу (`./use-x`, `../types`), не через свой barrel (самоимпорт). `model/types.ts` — это файл, не папка: импортируется напрямую `../model/types`, без barrel. Плоский `model/` (нет подпапок, только `use-x.ts` + `types.ts`) — barrel не нужен, импорт по файлу.

**Типы:**

- Локальные типы одного хука (`Props`, ввод/вывод, internal unions) — **рядом в том же файле**, не выносить.
- Публичные типы слайса (используются другими слайсами через barrel) — в `model/types.ts`.
- Если у подсистемы-папки свои внутренние типы — `model/<subsystem>/types.ts`.

Не создавай отдельный сегмент `types/` или `hooks/` — это разделение по форме файла, а не по природе кода (антипаттерн FSD).

**`lib/`** — чистые функции без React-зависимостей:

```
entities/room/lib/
  cache.ts          ← readRoomTokenCache / writeRoomTokenCache
  validation.ts     ← isRoomNameValid
  group-rooms.ts    ← фильтрация + сортировка коллекций
```

Если функция возвращает JSX — это компонент, переместить в `ui/`.

**Эвристика `lib/` vs `model/`:** функция использует React (`useState`, `useEffect`, контекст) → `model/`. Чистая (получает аргументы, возвращает значение) → `lib/`. Класс ошибки, парсеры, мапперы — `lib/`. Набор значений-настроек/констант — `config/`.

**`api/` в слайсе** — интеграция с внешним сервисом, привязанная к домену слайса: подписки, мапперы, сервис-специфичные обёртки. Отличие от `model/` — `api/` это I/O-граница (network, realtime, push-сервис), `model/` — хуки и типы стейта.

```
entities/user/
  api/
    auth-bridge.ts   ← subscribeAuth: подписка на authClient.useSession / onAuthStateChange
  model/
    use-current-user.ts
    types.ts
```

Эвристика: код **слушает/шлёт** во внешний сервис → `api/`. Код **читает/выводит** доменный стейт → `model/`. Project-agnostic RPC-клиент (не привязан к домену) → `shared/api/` (ниже).

**`api/` в `shared/`** — axios-обёртки по доменам:

```text
shared/api/
  http/      ← axios instance: baseURL, Bearer-токен, нормализация ошибок
  rooms/     ← listRooms / createRoom / deleteRoom
  livekit/   ← fetchLiveKitToken
  auth/      ← better-auth client (authClient, getAuthToken, clearToken)
  index.ts
```

HTTP через общий axios-инстанс из `shared/api/http`. Ручной `fetch` — не надо: инстанс уже вешает `Authorization` и разворачивает `{ error }` от сервера в `Error(message)`.

```ts
import { api } from '../http';

import type { CreateRoomRequest, Room } from '@chatovo/schemas';

export const createRoom = async (input: CreateRoomRequest): Promise<Room> => {
  const { data } = await api.post('/rooms', input);

  return data;
};
```

Типы запроса/ответа — из `@chatovo/schemas` (тот же контракт, что валидирует NestJS). Функция возвращает `data`, ошибки летят исключением — их ловит React Query.

---

## 12. Глобальные стили и SCSS

- Токены темы — CSS variables в `app/globals.scss` (`:root` + `.dark`).
- Тёмная тема — `<html className="dark">` хардкодом (несовместимо с `next-themes` + Tauri).
- Токены темы, отступы, размеры — `shared/styles/_tokens.scss` (`--space-*`, `--icon-*`, `--control-*`, цвета, радиусы). Подключается в `app/globals.scss`.
- Компонентные стили — `*.module.scss`; общие миксины — `@use '@/shared/styles/mixins' as *` (`loadPaths` + `turbopack.resolveAlias` в `next.config.ts`).
- `clsx` — склейка module-классов и `className` prop.

---

## 13. Пустые строки между логическими шагами

Biome не автофиксит `padding-line-between-statements`. Соблюдаем руками.

**Пустая строка перед:**

- `return` (если не первый statement)
- `throw`
- `if` (early-return guard или branching)
- `await` после которого идёт логически отдельный шаг
- `try` / `for` / `while` / `switch`

**После `if`-блока** — пустая строка перед следующим statement.

```ts
// ✓
const trimmed = room.trim();

if (!trimmed) throw new Error('Room name required');

const accessToken = await getFreshAccessToken();
const { token, url } = await fetchLiveKitToken({ room: trimmed }, accessToken);

writeRoomTokenCache(trimmed, { token, url });
router.push(`/room?name=${encodeURIComponent(trimmed)}`);
```

```ts
// ✓ множественные return
if (!name) return null;

if (query.isLoading) {
  return <Loader />;
}

return <VoiceRoom />;
```

**Исключения** (пустая НЕ нужна):

- Один statement в блоке.
- Однотипные single-line guards подряд:
  ```ts
  if (!a) return null;
  if (!b) return null;
  if (!c) return null;
  ```
- Последовательные `const` одного смыслового блока.

---

## 14. Shared схемы — `@chatovo/schemas`

Zod схемы и типы, общие для client/server, — в `packages/schemas`:

```
packages/schemas/src/
  rooms/
    inputs.ts    ← createRoomInputSchema
    outputs.ts   ← roomSchema
    types.ts     ← Room, CreateRoomInput, CreateRoomRawInput
    index.ts
  livekit/
    ...
```

```ts
// ✓ ОК
import { createRoomInputSchema, type Room } from '@chatovo/schemas/rooms';

// ✗ НЕ ОК
import { Room } from '@/shared/api';
```

`@/shared/api` экспортирует только runtime функции (RPC wrappers, better-auth client).

**FormValues vs Request типы.** Одна zod-схема даёт два типа — `.default()` / `.transform()` делают `z.input` и `z.output` несовместимыми:

- `CreateRoomFormValues = z.input<typeof schema>` — форма данных **до** валидации, для `defaultValues` формы.
- `CreateRoomRequest = z.output<typeof schema>` — форма **после** валидации (default применён, transform отработал), для submit / API body.

Это ось «стадия валидации», не «HTTP request/response». Response-тип сущности — отдельный (`Room`), не `z.output` инпут-схемы.

---

## 15. Формы — react-hook-form + zodResolver

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createRoomInputSchema, type CreateRoomInput, type CreateRoomRawInput } from '@chatovo/schemas/rooms';

const DEFAULT_VALUES: CreateRoomRawInput = { name: '', isPrivate: false };

const { formState: { errors }, handleSubmit, register, reset } = useForm<
  CreateRoomRawInput,
  unknown,
  CreateRoomInput
>({
  resolver: zodResolver(createRoomInputSchema),
  defaultValues: DEFAULT_VALUES,
});
```

- Схема — в `@chatovo/schemas/<resource>`, не inline в форме.
- Server-side ошибки — `setError('field', { message: err.message })`.
- Boolean toggles вне формы — `useBoolean` из `@siberiacancode/reactuse`, не `useState`.

---

## 16. Conditional render — ts-pattern

3+ ветки render → `match`, не вложенные `if (...) return <X />` и не цепочки тернарников в JSX.

Что матчить — два варианта, оба ОК:

**A. На discriminated union из хука.** Хук собирает `state`-union, view только `match`. Берём когда логика сборки объёмна или переиспользуется:

```tsx
import { match } from 'ts-pattern';

return match(state)
  .with({ kind: 'loading' }, () => <RoomLoadingFallback />)
  .with({ kind: 'active' }, ({ token, url }) => <VoiceRoom token={token} serverUrl={url} />)
  .exhaustive();
```

`.exhaustive()` даёт TS-ошибку если добавили вариант union но забыли case.

**B. На объекте сырых хуков.** `match` прямо на `{ ...поля хуков }`, паттерны через `P.nullish` / `P.string` и т.п. Берём когда веток немного, логика компактна, отдельный хук-слой был бы лишней церемонией:

```tsx
import { match, P } from 'ts-pattern';

const { data: room, isLoading } = useRoomById(roomId);
const { data: publicTokenData } = usePublicRoomToken(roomId, !!room && !room.isPrivate);
const tokenData = room?.isPrivate ? tokenMutation.data : publicTokenData;

return match({ roomId, isLoading, room, tokenData })
  .with({ roomId: P.nullish }, () => null)
  .with({ room: P.nullish, isLoading: true }, () => <RoomLoadingFallback />)
  .with({ room: P.nullish }, () => <RoomNotFound />)
  .with({ tokenData: P.nullish }, () => <RoomConnecting />)
  .with({ tokenData: P.nonNullable, room: P.nonNullable }, ({ tokenData }) => (
    <VoiceRoom serverUrl={tokenData.url} token={tokenData.token} />
  ))
  .exhaustive();
```

Порядок `.with` важен — первый совпавший паттерн выигрывает. Узкие значения в хендлерах
бери из аргумента `match` (он narrowed), не из замыкания и не через `as` — каст обходит
проверку типов.

**Запрещено в любом случае** — `if`/тернарник-цепочки, собирающие JSX:

```tsx
// ✗ НЕ ОК — condition hell в view
return !roomId ? null : roomById.isLoading ? <Loading /> : !room ? <NotFound /> : <Room />;
```

**Когда выносить в хук:** сборка state переиспользуется в 2+ местах, либо тело логики
настолько объёмно, что view перестаёт читаться. Иначе вариант B инлайн в view — норма.

### 15.1 Одна ветка — `&&`, не `? : null`

Рендер «есть/нет» (одна ветка, иначе ничего) — `cond && <X />`, не `cond ? <X /> : null`:

```tsx
// ✗ НЕ ОК — лишний : null
{isAdmin ? <span className={s.badge}>admin</span> : null}
{room.isPrivate ? <Lock /> : null}

// ✓ ОК
{isAdmin && <span className={s.badge}>admin</span>}
{room.isPrivate && <Lock />}
```

Инверсия `cond ? null : <X />` → `!cond && <X />`.

**Условие обязано быть `boolean`.** `&&` рендерит левый операнд как есть — для
не-boolean falsy (`0`, `''`, `NaN`) это выведет мусор (стрелочный `0` в разметке).
Числовые/строковые проверки сначала приводим к boolean:

```tsx
// ✗ ОПАСНО — при пустом массиве отрендерит "0"
{participants.length && <List />}

// ✓ ОК — явная boolean-проверка
{participants.length > 0 && <List />}
{!isEmpty(participants) && <List />}   // isEmpty из remeda
```

Безопасны как условие: boolean-флаги (`isActive`), сравнения (`x === y`),
`!x`, `!!x`, объект/`undefined` (`errors.name`), `isEmpty()`/`isNonNullish()`.

Тернарник остаётся для **двух** реальных веток (`cond ? <A /> : <B />`).

---

## 17. Drill cleanup

Если данные доступны через глобальный хук — leaf берёт сам, не принимает props:

```tsx
// ✗ ПЛОХО — drilling
<ChannelsList displayName={x} isAdmin={z} rooms={r} onDelete={d} />

// ✓ ОК
const ChannelsList = () => {
  const rooms = useRooms();
  const { displayName, isAdmin } = useCurrentUser();
  // ...
};
```

**Не делать generic параметризированные компоненты** для статичного контента:

```tsx
// ✗ НЕ ОК — text всегда один и тот же
<RoomLoader text="Loading room..." />

// ✓ ОК
<RoomLoadingFallback />   // текст внутри
<RoomConnecting displayName="x" /> // только динамическая часть
```

**Оставляем props когда:**

- Данные приходят из `.map` (`<ChannelsRoomItem room={room} />`).
- UI state оркестратора (`channelsOpened` в `AppSidebar`).
- Колбэк требует контекст родителя.

---

## 18. Server — см. apps/server/CLAUDE.md

Этот гайд покрывает `apps/client/`. Конвенции API (NestJS-модули, `createZodDto` из `nestjs-zod`, глобальный `AuthGuard` + `@Public()`, WebSocket-gateway, доменные события) описаны в [`apps/server/CLAUDE.md`](../apps/server/CLAUDE.md) — единственный источник правды по серверу.

---

## 19. Запреты

- `console.log` в коммите. Biome `noConsole: warn` (`shared/ui/**`, `scripts/**` — off).
- `any` — Biome `noExplicitAny: error`. Используй `unknown`.
- Non-null assertion `!` без обоснования — Biome `noNonNullAssertion: warn`.
- Deep imports мимо barrel.
- Cross-import между слайсами одного слоя.
- ESLint, Prettier, CSS-in-JS. Только Biome + SCSS modules.
- Ручной `fetch` / свой `axios.create` для бизнес-вызовов. Только общий инстанс из `shared/api/http`.
- Дублирование схем client/server. Только `@chatovo/schemas`.
- `useState` для form fields. Только `react-hook-form`.
- Вложенные `if (...) return <X />` на 3+ ветки. Используй `ts-pattern match`.
- Prop-drilling когда leaf может вызвать хук сам.

---

## 20. Чек-лист перед коммитом

```bash
bun lint:fix                               # Biome: формат + organize imports + safe fixes
bun lint                                   # должно быть 0 errors/warnings
cd apps/client && bunx tsc --noEmit        # типы client
cd apps/server && bunx tsc --noEmit        # типы server
bun --filter @chatovo/client build          # сборка client
bun --filter @chatovo/server build          # сборка server
```

`bun lint:fix` не чинит: пустые строки (секция 13), порядок хуков (секция 9.1), FSD-границы импортов (→ [`docs/fsd.md`](./fsd.md)).
