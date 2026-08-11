---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- COMPRESSED editing-версия: автозагружается при правке любого TS/JS-файла (paths-фронтматтер). -->
<!-- Полная версия с примерами и обоснованиями — docs/style.md; держи в синхроне при изменении правила. -->

# Code Style — общий (TypeScript)

Действует во всём репозитории. Клиентские дополнения — `code-style-client.md`, серверные — `code-style-server.md`. Один канонический пример на правило; `✗` показан там, где ошибка неочевидна.

## 1. Типы

`type` для всего — Props, unions, алиасы, DTO. `interface` запрещён. `unknown` вместо `any` (`ts/no-explicit-any`). Non-null `!` без обоснования запрещён — проверка или `?.`. Варианты состояния — discriminated union.

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number };
```

`import type` / `export type` чинит `bun lint:fix` (в `apps/server/**` правило выключено — Nest резолвит зависимости по метаданным декораторов).

## 2. Функции

**2+ аргумента → один объект с деструктуризацией.** Позиционные одного типа легко перепутать. Одноаргументные (`listFriends(userId)`) остаются позиционными.

```ts
resolveDisplayName({ displayName, name, email, userId });

// ✗ resolveDisplayName(displayName, name, email, userId);
```

**Объявления — block body с `return`.** Expression body только у: React-компонентов с JSX, inline-колбэков (аргумент функции, JSX-проп).

```ts
const readRole = (user: User | null): UserRole => {
  return user?.role === 'admin' ? 'admin' : 'user';
};

arr.map((x) => x.id); // ✓ аргумент — expression ок

// ✗ const readRole = (user: User | null): UserRole => user?.role === 'admin' ? 'admin' : 'user';
```

**`if` / `else if` / `else` — всегда `{}`**, даже на одну строку. Тернарник для возврата значения — ок (`return a ? b : c`).

```ts
if (!isTauri()) {
  return;
}

// ✗ if (!isTauri()) return;
```

## 3. Независимые `await` — параллельно

Второй вызов не использует результат первого → `Promise.all`. Последовательные `await` складывают задержки.

```ts
const [user, rooms] = await Promise.all([getUser(id), getRooms(id)]);

// ✗ const user = await getUser(id); const rooms = await getRooms(id);
```

`Promise.allSettled` — когда частичный отказ допустим (нотификации, аналитика). Последовательность оставляем, когда порядок значим: второй вызов принимает результат первого, проверка прав перед мутацией, запись перед чтением, шаги транзакции.

## 4. Деструктуризация

Значение через точку 2+ раза или вложенное — вытащи. Не деструктурируй: одно обращение, потеря контекста (`user.name` понятнее голого `name`), неймспейс-объекты (`router`, `Math`).

```ts
const { size, type } = file;
if (size === 0) ...;
if (size > MAX) ...;
```

## 5. Комментарии

**Прикладной код — без комментариев** (`views/`, `widgets/`, `features/`, `entities/`, `modules/`). Нужен комментарий для блока — вынеси блок в функцию с именем.

**Исключение — публичная поверхность переиспользуемых модулей** (`shared/ui`, `shared/lib`, `shared/hooks`, серверный `src/lib/`, `packages/schemas`): у **экспортируемого** примитива допустим JSDoc в 1–2 строки, **если сигнатура не объясняет назначение** (неочевидные единицы, побочный эффект, граничное поведение).

```ts
/** Возвращает `null`, если пользователь отменил диалог выбора файла. */
export const pickAvatarFile = async (): Promise<File | null> => { ... };

// ✗ /** Форматирует байты в строку. */ — пересказ сигнатуры
```

Внутренние хелперы не документируются никогда. Закомментированный код и `// TODO` без задачи запрещены везде. Легитимны директивы: `eslint-disable-next-line ... -- причина`, `@ts-expect-error` с причиной, `'use client'`.

## 6. Пустые строки между логическими шагами

ESLint не автофиксит — руками. Пустая строка перед `return` (если не первый statement), `throw`, `if`, `try` / `for` / `while` / `switch`, и после `if`-блока.

```ts
const trimmed = room.trim();

if (!trimmed) throw new Error('Room name required');

const { token, url } = await fetchLiveKitToken({ room: trimmed });

router.push(`/room?name=${encodeURIComponent(trimmed)}`);
```

Исключения: один statement в блоке, однотипные single-line guards подряд, последовательные `const` одного смыслового блока.

## 7. Импорты

Группы (пустая строка между, сортирует `bun lint:fix`): внешние типы → внешние value → локальные типы `@/` → локальные value `@/` → относительные типы → относительные value → стили. Не удаляй пустые строки между группами вручную.

Deep import мимо barrel запрещён. Wildcard `export * from` запрещён — только явные именованные.

## 8. Shared-схемы

Zod-схемы и типы, общие для client/server, — только `@chatovo/schemas`. Дублирование схем запрещено. Одна схема даёт два типа: `z.input` (форма до валидации, для `defaultValues`) и `z.output` (после — для submit / API body).

## 9. Запреты

- `console.log` в коммите (`no-console`; `**/scripts/**` — off).
- `any`, non-null `!` без обоснования.
- Deep imports мимо barrel, cross-import между слайсами одного слоя.
- Ручной `fetch` / свой `axios.create` для бизнес-вызовов.
- Дублирование схем client/server.
- Хендролл того, что уже есть в зависимостях (remeda, ts-pattern, date-fns, reactuse) — см. «Reuse over reinvention» в корневом `CLAUDE.md`.

## 10. Проверка

`bun run fix` (ESLint --fix + Prettier + Stylelint --fix), затем `bun run verify`. `fix` не чинит: пустые строки (§6), порядок хуков, FSD-границы импортов.
