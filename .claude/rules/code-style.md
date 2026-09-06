---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- COMPRESSED editing version: auto-loads when editing any TS/JS file (paths frontmatter). -->
<!-- Full version with examples and reasoning — docs/guides/style.md; keep in sync when a rule changes. -->

# Code Style — shared (TypeScript)

Applies across the whole repository. Client additions — `code-style-client.md`, server ones — `code-style-server.md`. One canonical example per rule; `✗` is shown where the mistake is not obvious.

## 1. Types

`type` for everything — Props, unions, aliases, DTOs. `interface` is banned. `unknown` instead of `any` (`ts/no-explicit-any`). A non-null `!` without justification is banned — use a check or `?.`. State variants are a discriminated union.

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number };
```

`import type` / `export type` is fixed by `bun lint:fix` (the rule is off under `apps/server/**` — Nest resolves dependencies from decorator metadata).

## 2. Functions

**2+ arguments → a single object with destructuring.** Same-typed positional args are easy to mix up. Single-argument functions (`listFriends(userId)`) stay positional.

```ts
resolveDisplayName({ displayName, name, email, userId });

// ✗ resolveDisplayName(displayName, name, email, userId);
```

**Declarations use a block body with `return`.** An expression body is allowed only for React components returning JSX and for inline callbacks (a function argument, a JSX prop).

```ts
const readRole = (user: User | null): UserRole => {
  return user?.role === 'admin' ? 'admin' : 'user';
};

arr.map((x) => x.id); // ✓ an argument — an expression is fine

// ✗ const readRole = (user: User | null): UserRole => user?.role === 'admin' ? 'admin' : 'user';
```

**`if` / `else if` / `else` always use `{}`**, even for a single line. A ternary that returns a value is fine (`return a ? b : c`).

```ts
if (!isTauri()) {
  return;
}

// ✗ if (!isTauri()) return;
```

## 3. Independent `await` calls go in parallel

The second call does not use the first one's result → `Promise.all`. Sequential `await`s add up the latency.

```ts
const [user, rooms] = await Promise.all([getUser(id), getRooms(id)]);

// ✗ const user = await getUser(id); const rooms = await getRooms(id);
```

`Promise.allSettled` — when partial failure is acceptable (notifications, analytics). Keep the sequence when the order matters: the second call consumes the first's result, a permission check before a mutation, a write before a read, transaction steps.

## 4. Destructuring

A value reached through the dot 2+ times, or arriving nested, gets pulled out. Do not destructure: a single access, a loss of context (`user.name` is clearer than a bare `name`), namespace objects (`router`, `Math`).

```ts
const { size, type } = file;
if (size === 0) ...;
if (size > MAX) ...;
```

## 5. Comments

**Application code carries no comments** (`views/`, `widgets/`, `features/`, `entities/`, `modules/`). If a block needs a comment, extract the block into a named function.

**Exception — the public surface of reusable modules** (`ui-kit`, `shared/lib`, `shared/hooks`, the server's `src/lib/`, `packages/schemas`): an **exported** primitive may carry a 1–2 line JSDoc **when the signature does not explain the purpose** (non-obvious units, a side effect, edge-case behaviour).

```ts
/** Returns `null` if the user cancelled the file picker dialog. */
export const pickAvatarFile = async (): Promise<File | null> => { ... };

// ✗ /** Formats bytes into a string. */ — restates the signature
```

Internal helpers are never documented. Commented-out code and a `// TODO` with no ticket are banned everywhere. Directives are legitimate: `eslint-disable-next-line ... -- reason`, `@ts-expect-error` with a reason, `'use client'`.

## 6. Blank lines between logical steps

ESLint does not autofix this — by hand. A blank line before `return` (unless it's the first statement), `throw`, `if`, `try` / `for` / `while` / `switch`, and after an `if` block.

```ts
const trimmed = room.trim();

if (!trimmed) throw new Error('Room name required');

const { token, url } = await fetchLiveKitToken({ room: trimmed });

router.push(`/room?name=${encodeURIComponent(trimmed)}`);
```

Exceptions: a single statement in a block, uniform single-line guards in a row, consecutive `const`s of one logical block.

## 7. Imports

Groups (blank line between, sorted by `bun lint:fix`): external types → external values → local types `@/` → local values `@/` → relative types → relative values → styles. Do not remove the blank lines between groups by hand.

A deep import past a barrel is banned. Wildcard `export * from` is banned — explicit named exports only.

## 8. Shared schemas

Zod schemas and types shared by client and server live only in `@chatovo/schemas`. Duplicating schemas is banned. One schema yields two types: `z.input` (the shape before validation, for `defaultValues`) and `z.output` (after — for submit / the API body).

## 9. Bans

- `console.log` in a commit (`no-console`; `**/scripts/**` — off).
- `any`, a non-null `!` without justification.
- Deep imports past a barrel, cross-imports between slices of the same layer.
- A manual `fetch` / your own `axios.create` for business calls.
- Duplicating schemas between client and server.
- Hand-rolling what the dependencies already provide (remeda, ts-pattern, date-fns, reactuse) — see "Reuse over reinvention" in the root `CLAUDE.md`.

## 10. Verification

`bun run fix` (ESLint --fix + Prettier + Stylelint --fix), then `bun run verify`. `fix` does not fix: blank lines (§6), hook order, FSD import boundaries.
