---
paths:
  - "apps/client/**/*.{ts,tsx}"
---

<!-- COMPRESSED editing version: auto-loads when editing files under apps/client (paths frontmatter). -->
<!-- Full version with examples and reasoning — docs/guides/style.md; layer architecture — docs/architecture/fsd.md. Keep in sync when a rule changes. -->

# Code Style — client (Next.js 16 / React 19, FSD)

Extends the shared `code-style.md`. Layer architecture — `docs/architecture/fsd.md`, local conventions — `apps/client/CLAUDE.md`.

## 1. Slice structure

Segments: `ui/` `model/` `lib/` `api/` `config/` + `index.ts` (public API). The minimum is `ui/` + `index.ts`.

The main component sits flat in `ui/` with its files next to it: `VoiceRoom.tsx`, `VoiceRoom.types.ts`, `VoiceRoom.module.scss`. Subcomponents go in `ui/components/<Name>/` with an aggregating `components/index.ts` that points straight at the file (`export { X } from './X/X'`) — with **no** per-component `index.ts`.

The parent imports through the `./components` barrel, not `./components/ChannelsHeader`.

`ui-kit` is the design system (`primitives/` `components/` `icons/` `styles/`), each component in a PascalCase folder with its own `index.ts`. From outside — only `@/ui-kit`; inside — relative imports.

## 2. Naming

| What | How |
|---|---|
| Slices, segments, hook/utility files | kebab-case (`voice-room`, `use-room-state.ts`) |
| Component folder and file | PascalCase (`VoiceRoom/VoiceRoom.tsx`) |
| Types | `<Name>Props`, `<Name>.types.ts`, `Use<Name>Input`, DTO `<Name>Input/Output` |
| Hook / utility (export) | `useEnterRoom` / `groupMessages` |

The deviation from FSD canon (kebab-case everywhere there) is deliberate.

## 3. Component size

**100 lines per JSX file, maximum.** Over the limit: subcomponents → `components/`, logic → `model/` (a hook), utilities → `lib/`.

A barrel of related primitives (`Dialog`, `Sheet`, `DropdownMenu` with 8–15 exports) is no exception: each part goes in `components/<Name>/` and `<Name>.tsx` is a thin re-export. Group by meaning (`Header` / `Footer` / `Title` together), not "one file per export". Context shared by the parts goes into its own module next to them (`dialog-overlay-context.ts`), otherwise you get an import cycle.

A side effect with no markup is a headless controller in `ui/controllers/` that renders `null` and is assembled into an orchestrator fragment. A pile of `useEffect` in the main component is banned.

## 4. Props field order

One order in three places: `type Props` ↔ destructuring ↔ the JSX call. The groups: **data** (including `children`) → **identifiers/styles** (`id`, `className`, `style`) → **handlers** (`on<Event>`). A mismatch between the three is caught at review.

## 5. Hook order

ESLint does not sort them — by hand. Groups, with a blank line between:

1. Navigation (`useRouter`, `useSearchParams`)
2. Store / context (`useCurrentUser`, `use<Name>Store`)
3. Data (TanStack Query/Mutation)
4. State (`useState`, `useReducer`)
5. Ref
6. Memo / callbacks (`useMemo`, `useCallback`, `useTransition`, `useId`)
7. Effects
8. Derived const

Custom hooks go by what they do inside (`useRooms` runs a `useQuery` → the Data group). Never move a hook across a data dependency: if `name` is needed by `useRoomToken({ roomName: name })`, `name` comes first. `if (...) useFoo()` is a `rules-of-hooks` bug — fix it, don't sort it.

## 6. Effects and deps

`deps` holds only what **should re-trigger** the effect. Stable refs (`router`, `mutate` / `reset` from react-query) don't go into deps; `eslint-disable-next-line react/exhaustive-deps -- reason` with an explicit reason is normal practice.

```tsx
// eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on roomId change; router is a stable ref
useEffect(() => {
  if (!roomId) router.replace(ROUTES.lobby);
}, [roomId]);

// ✗ }, [roomId, room, router, tokenMutation]); — the mutation object changes its ref every render
```

**Anti-pattern: `useEffect` + `mutate` to load data** → refetch loops. Declarative loading is `useQuery` with a key (`queryKey: [roomId]`); react-query refetches on a key change by itself.

A fresh callback inside an effect without re-running the effect — `useEffectEvent`, not a hand-rolled `cbRef.current = cb`.

## 7. Destructuring query / mutation

`useQuery` is destructured immediately, with `data` renamed to say what it is. `useMutation` stays a whole object — you need both its fields and its methods.

```tsx
const { data: room, isLoading } = useRoomById(roomId);
const tokenMutation = useRoomTokenMutation(); // ✓ mutation — an object

// ✗ const roomById = useRoomById(roomId); const room = roomById.data;
```

## 8. Conditional render — ts-pattern

3+ branches → `match` (on a discriminated union from a hook, or directly on an object of raw hooks with `P.nullish` / `P.nonNullable`). `.exhaustive()` is mandatory. The order of `.with` matters — the first match wins; take narrowed values from the handler's argument, not from the closure and not via `as`.

```tsx
// ✗ condition hell in the view
return !roomId ? null : isLoading ? <Loading /> : !room ? <NotFound /> : <Room />;
```

**A single branch — `&&`, not `? : null`.** The condition must be a boolean: `&&` renders the left operand as-is, so `0` / `''` end up in the markup.

```tsx
{isAdmin && <Badge />}
{participants.length > 0 && <List />}

// ✗ {participants.length && <List />} — renders "0" on an empty array
// ✗ {isAdmin ? <Badge /> : null}
```

The ternary is for two real branches.

## 9. The model / lib / api segments

**`model/`** — hooks, stores, contexts, state types. A subsystem (Provider + context + hook) gets its own folder with an `index.ts`. Grouping inside: `model/hooks/`, `model/contexts/`, `model/stores/` — each with its own barrel. **Do NOT create a slice-level `model/index.ts`**; an import from outside goes through the subfolder's barrel, and inside a subfolder you import by file.

Types local to a single hook live in the same file. The slice's public types go in `model/types.ts` (a file, imported directly). Separate `types/` and `hooks/` segments at the top level of a slice are an FSD anti-pattern.

**`lib/`** — pure functions with no React. Returns JSX → it's a component, move it to `ui/`. Uses React → `model/`. Constants → `config/`.

**One file per task, a folder per cluster.** A single export with an obvious name is a flat file (`lib/group-rooms.ts`). The moment a file gains its own type, a test or a second companion file, create a folder and put them together: `<fn-name>/<fn-name>.ts` + `index.ts` + `<fn-name>.types.ts` + `_tests/`. Same in `shared/lib/` and in the server's `src/lib/`. A flat `<fn-name>.types.ts` next to a flat `<fn-name>.ts` is already a reason to create a folder; types belong in their function's folder, not in the segment's common pile.

```text
shared/lib/build-room-href/          ✓ the function + its type + its test together
├── build-room-href.ts
├── build-room-href.types.ts
├── index.ts
└── _tests/build-room-href.test.ts

shared/lib/build-room-href.ts        ✗ sitting next to build-room-href.types.ts
```

The exception is `model/hooks/`, `model/contexts/`, `model/stores/`: files there sit flat under a shared barrel, and a hook gets a folder only once it has its own `.types.ts` and tests.

**`api/`** — the I/O boundary (subscriptions, mappers, service wrappers). Listens to / sends to an external service → `api/`; reads / derives domain state → `model/`.

HTTP goes only through the shared axios instance from `shared/api/http` (it attaches `Authorization` and unwraps `{ error }` into an `Error`). A manual `fetch` / your own `axios.create` is banned. Request/response types come from `@chatovo/schemas`.

## 10. Styles

SCSS modules only (`*.module.scss`); CSS-in-JS is banned. Tokens are CSS variables in `app/globals.scss` + `ui-kit/styles/_tokens.scss`. Shared mixins come from `@use '@/ui-kit/styles/mixins' as *`, with no `../../../`. Joining classes is `clsx` directly, without a `cn()` wrapper. Conditional variants are maps in TSX or `cva`.

Enter/exit animations and layout transitions use `motion`; CSS keeps hover/focus, infinite loops and decorative background.

## 11. Forms

`react-hook-form` + `zodResolver`, with the schema from `@chatovo/schemas/<resource>` (not inline). `useState` for form fields is banned. Server-side errors go through `setError('field', { message })`. Boolean toggles outside a form use `useBoolean` from reactuse.

## 12. Drill cleanup

When data is reachable through a global hook, the leaf takes it itself instead of accepting props. Don't parameterise static content (`<RoomLoader text="Loading room..." />` → `<RoomLoadingFallback />`).

Keep props for: data from a `.map`, the orchestrator's UI state, a callback that needs the parent's context.

## 13. React conventions

Function components, arrow functions. `'use client'` in every file with hooks / state / handlers. React Compiler is enabled — `useMemo` / `useCallback` only for a semantically stable ref. React types are named imports (`import type { ReactNode } from 'react'`); `import type * as React` is banned. Handlers are `on<Event>` in camelCase.
