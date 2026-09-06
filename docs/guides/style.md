<!-- FULL version: detailed examples + anti-patterns + reasoning. Read on demand (review, disputed case), and in full by the reviewer agent. -->
<!-- Compact editing versions auto-load while editing: .claude/rules/code-style.md (whole repo), code-style-client.md (apps/client), code-style-server.md (apps/server) — keep them in sync when a rule changes. -->

# Chatovo Style Guide

Project code-style conventions for `apps/client/`. Architectural rules live in [`docs/architecture/fsd.md`](../architecture/fsd.md).

> **Compact versions.** The sections of this guide are split across `.claude/rules/*.md` with a `paths:` frontmatter — they load automatically when you edit a matching file. This is the full version, with examples and reasoning; a rule change goes into both places.

Tooling:

- **ESLint** (`bun lint` / `bun lint:fix`) — linter + import sorting. Config: root `eslint.config.mjs` on top of `@siberiacancode/eslint` (`{ typescript: true, react: true, jsxA11y: true }`).
- **Prettier** (`bun format` / `bun format:check`) — formatter. Config: `prettier.config.mjs` (re-exports `@siberiacancode/prettier` unchanged), exclusions in `.prettierignore`.
- **Stylelint** (`bun lint:css` / `bun lint:css:fix`) — SCSS. Config: `stylelint.config.mjs` on top of `@siberiacancode/stylelint`; property order from `stylelint-config-idiomatic-order`.
- **TypeScript** strict + `noUnusedLocals` + `noUnusedParameters`.
- FSD boundaries and a number of React conventions are held by hand and caught at review (the linter does not cover them: hook order, `padding-line-between-statements`, FSD cross-slice imports).

One command each way: `bun run verify` (typecheck + lint + format:check + lint:css) and `bun run fix` (lint:fix + format + lint:css:fix).

**Why ESLint + Prettier:** the shared `@siberiacancode/*` presets are reused across the author's projects (the same stack in GnomeVPN) — identical rules with no per-repo reconfiguration. ESLint provides the React-specific rules (`rules-of-hooks`, `exhaustive-deps`, purity) that Biome lacks.

---

## 1. Slice structure

Every slice is a folder of segments. The minimum is `ui/` + `index.ts`:

```
widgets/voice-room/
  index.ts          ← public API (barrel)
  ui/               ← React components
  model/            ← hooks, Zustand store, state types
  lib/              ← pure slice utilities
  api/              ← I/O boundary: subscriptions, mappers, service wrappers (if any)
  config/           ← constants, config
```

---

## 2. Slice `ui/` structure

The **main component** sits flat in `ui/`, with its files next to it:

```
widgets/voice-room/ui/
  VoiceRoom.tsx          ← JSX + entry component
  VoiceRoom.types.ts     ← Props and local union types
  VoiceRoom.module.scss  ← component styles
```

**Subcomponents** (used only inside the parent) go one per folder under `components/`:

```
widgets/channels-panel/ui/
  ChannelsPanel.tsx
  ChannelsPanel.module.scss
  components/
    index.ts                   ← barrel: re-exports every subcomponent
    ChannelsHeader/
      ChannelsHeader.tsx
      ChannelsHeader.types.ts
      ChannelsHeader.module.scss
      index.ts                 ← `export { ChannelsHeader } from './ChannelsHeader';`
    ChannelsList/
      ...
```

The parent imports through the barrel:

```ts
// ✓ OK
import { ChannelsHeader, ChannelsList } from './components';

// ✗ NOT OK
import { ChannelsHeader } from './components/ChannelsHeader';
```

**File rules:**

- `.types.ts` — create it only when there are Props or local union types.
- `.module.scss` — component styles (import as `import s from './Foo.module.scss'`). Mandatory on every layer.
- `ui-kit/` — the design system (primitives/components/icons/styles). **No flat `button.tsx`** — every primitive lives in a PascalCase folder (§2.1). From outside, import `@/ui-kit`.

### 2.1. `ui-kit` structure

`ui-kit/` is a separate layer next to `shared/`: every layer imports it, and it imports nothing but itself. Each component is its own PascalCase folder.

```
ui-kit/
  index.ts                    ← re-export primitives + components + icons
  primitives/                 ← base, depend on no other component
    index.ts                  ← re-export every primitive
    Button/
      Button.tsx
      Button.module.scss
      Button.types.ts         ← optional
      index.ts                ← export { Button } from './Button';
                              ← export type { ButtonProps } from './Button.types';
    Dialog/
      Dialog.tsx
      Dialog.module.scss
      Dialog.types.ts
      index.ts
  components/                 ← composed, built out of primitives
    FormField/
      FormField.tsx
      FormField.module.scss
      index.ts
    ConfirmDialog/
      ...
  icons/
    LogoMark/
      LogoMark.tsx
      index.ts
  styles/                     ← _tokens, _mixins, _functions, _breakpoints, _keyframes
```

**Rules:**

- Component folder and file names are **PascalCase** (`Button/`, `Button.tsx`).
- **`primitives/` vs `components/`**: a primitive imports no other ui-kit component (beyond its own parts); anything assembled from two or more primitives belongs in `components/`.
- **A per-component `index.ts` is mandatory** — explicit named re-exports of the component and its types, no `export *`. Aggregating barrels (`primitives/index.ts`, `ui-kit/index.ts`) re-export the folders.
- Styles are **`*.module.scss`**; shared utilities are imported as `@use '@/ui-kit/styles/mixins' as *` (the `@/` alias comes from `loadPaths` + `turbopack.resolveAlias` in `next.config.ts`, so no `../../../`).
- Headless + a11y come from **`@base-ui/react`** (Dialog → `Dialog`, Menu → `Menu`, Select → `Select`, …); import from the package subpath.
- React types are **named imports** (`ComponentProps`, `ReactNode`, …), never `import type * as React`.
- Inside `ui-kit`, imports between segments are relative (`../../primitives/Button`). From outside, only `@/ui-kit`.

### Slice barrel

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

### Headless controllers (`ui/controllers/`)

A side effect with no markup is a component that renders `null` and encapsulates one effect (sync mic state, sync tray, sounds, shortcuts). Each gets a folder under `ui/controllers/`, and they are assembled into a single orchestrator fragment:

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

That way effects don't bloat the body of the main component, each is isolated and testable on its own. The alternative — "a pile of `useEffect` in `VoiceRoom.tsx`" — is banned (it blows the 100-line limit, section 4).

### Examples

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
@use '@/ui-kit/styles/mixins' as *;

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

Conditional variants use `cva` from `class-variance-authority` on top of the module classes (see `ui-kit/primitives/Text/Text.variants.ts`).

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

### 2.2. `model/hooks` structure

Symmetric to `ui/`: **a hook with types of its own gets its own folder**, a flat file only when there are no types.

```
features/social/friend-chat/model/hooks/
  index.ts                          ← slice barrel
  use-friend-chat-session/
    use-friend-chat-session.ts      ← a hook without types doesn't need a folder,
    index.ts                           but consistency inside the slice wins
  use-friend-chat-unread/
    use-friend-chat-unread.ts
    use-friend-chat-unread.types.ts ← has an Input/Output type → folder required
    index.ts
```

The hook's `index.ts` re-exports both the hook and its types:

```ts
export { useFriendChatUnread } from './use-friend-chat-unread';

export type * from './use-friend-chat-unread.types';
```

A hook's input type is named `Use<Name>Input` (§5). If it repeats a component's props, don't duplicate — derive it: `Pick<VoiceRoomProps, 'roomId' | 'onLeave'>`.

---

## 3. Styles: SCSS modules

| Layer | Format |
|---|---|
| `ui-kit/**` | `*.module.scss` + CSS variables from `globals.scss` |
| widgets / features / views | `*.module.scss` |

| Case | Where |
|---|---|
| Component styles in `ui-kit` | `<Name>.module.scss` |
| Slice subcomponent styles | `<Name>.module.scss` |
| Joining module classes with an optional `className` prop | `clsx(...)` |
| Conditional classes | maps in TSX (`variantClass[variant]`) or SCSS modifiers |

The principle: JSX stays readable, and `s.root` / `s.header` tell you the structure.

---

## 4. Component size

**100 lines per JSX file, maximum.**

Over the limit means refactor:

1. Subcomponents → `components/`.
2. Logic → `model/` (a hook).
3. Utilities → the slice's `lib/`.

**A barrel of related primitives is no exception.** `ui-kit` components like `Dialog` / `Sheet` / `DropdownMenu` export 8–15 small parts (`Dialog`, `DialogContent`, `DialogHeader`, …). Keeping them in one file is not allowed: each part goes in `components/<Name>/`, and `<Name>.tsx` stays a thin re-export.

```
ui-kit/primitives/Dialog/
  Dialog.tsx                  ← only `export { ... } from './components'`
  Dialog.types.ts
  Dialog.module.scss
  dialog-overlay-context.ts   ← shared context (otherwise an import cycle)
  components/
    index.ts
    DialogRoot/DialogRoot.tsx
    DialogContent/DialogContent.tsx
    DialogHeader/DialogHeader.tsx   ← Header + Footer + Title + Description
    DialogClose/DialogClose.tsx     ← Close + Portal + Overlay
```

Group by meaning, not "one file per export": related parts (`Header` / `Footer` / `Title` / `Description`) live together.

**Context shared by the parts goes into its own module** next to `<Name>.tsx` (`dialog-overlay-context.ts`), never inside the component: otherwise `components/*` import the parent and the parent imports them. Context shared by several primitives goes in `ui-kit/lib/` (`menu-radio-group-context.ts`).

---

## 5. Naming

| What | How | Example |
|---|---|---|
| Slices | kebab-case | `voice-room`, `channels-panel` |
| Segments | kebab-case | `ui`, `model`, `lib`, `api`, `config` |
| Component folder | PascalCase | `VoiceRoom/`, `ChannelsFooter/` |
| Component file | PascalCase + `.tsx` | `VoiceRoom.tsx` |
| Types file | `<Name>.types.ts` | `VoiceRoom.types.ts` |
| Styles file | `<Name>.module.scss` | `Button.module.scss` |
| Hook file | kebab-case | `use-room-state.ts` |
| React component (export) | PascalCase | `VoiceRoom` |
| Hook | `use` + camelCase | `useEnterRoom`, `useRoomState` |
| Utility | camelCase | `groupMessages`, `formatTime` |
| Props type | `<Name>Props` | `VoiceRoomProps` |
| DTO type | `<Name>Input/Output` | `EnterRoomInput` |

> FSD canon: kebab-case for every file. Chatovo deviates: PascalCase for component folders and files, kebab-case for hooks and utilities.

---

## 6. Imports

### Aliases

`@/` → the `apps/client/` root. Use it for everything except relative imports within the same folder.

### Group order

Sorting is done by the `perfectionist/sort-imports` rule from the `@siberiacancode/eslint` preset, applied via `bun lint:fix`. The groups, **with a blank line between them**:

1. **External types** — `import type` from packages.
2. **External value imports** — packages, `node:` builtins, `@chatovo/*`.
3. **Local types** — `import type` via the `@/` alias.
4. **Local value imports** — `@/` aliases.
5. **Relative types** — `import type` from `./` `../`.
6. **Relative value imports** — `./` `../`.
7. **Styles** — `*.css` / `*.scss`.

```ts
// 1. external types
import type { MouseEvent } from 'react';

// 2. external value
import { useForm } from 'react-hook-form';

// 3-4. local types and values via alias
import { useCurrentUser } from '@/entities/auth/user';

// 5. relative types
import type { VoiceRoomProps } from './VoiceRoom.types';

// 6. relative value
import { groupMessages } from '../lib/grouping';

// 7. styles
import s from './VoiceRoom.module.scss';
```

Within a group, alphabetical order. ESLint inserts the blank lines between groups on `bun lint:fix`; don't remove them by hand.

### Bans

A deep import past a barrel is banned:

```ts
// ✗ BANNED
import { ChannelsList } from '@/widgets/room/channels-panel/ui/components/ChannelsList';
import { Button } from '@/ui-kit/primitives/Button';

// ✓ OK
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { Button } from '@/ui-kit';
```

`ui-kit` has a single root barrel, `@/ui-kit` (the atomic layer stays under the hood). Inside a slice, relative imports are fine.

ESLint does not check FSD boundaries — we catch them at review.

---

## 7. Barrel exports (`index.ts`)

**Slice:**

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

Only what is needed from outside. Internal subcomponents are not exported.

**Component folder:**

```ts
// ui/VoiceRoom/index.ts
export { VoiceRoom } from './VoiceRoom';
export type { VoiceRoomProps } from './VoiceRoom.types';
```

**A subsystem in `model/`:** when a hook is assembled from several files in a subfolder, the `index.ts` next to them exports only the public entry point — the Provider and the hook. Internal modules and types stay in.

```ts
// entities/room/model/rooms-presence/index.ts
export { RoomsPresenceProvider, useRoomsPresence } from './rooms-presence-context';
```

Wildcard exports (`export * from`) are banned. Explicit named exports only.

---

## 8. Types

- **Everything is a `type`** — Props, unions, aliases, DTOs. `interface` is banned.
- Props always live in `<Name>.types.ts` next to the component.
- `import type { ... }` — enforced by the `ts/consistent-type-imports` rule, `bun lint:fix` fixes it for you (the rule is off under `apps/server/**`: Nest resolves dependencies from decorator metadata).
- `export type { ... }` — enforced by the `ts/consistent-type-exports` rule.
- `unknown` instead of `any`. `any` is banned (`ts/no-explicit-any`).
- Discriminated unions for state variants:

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number; mime: string };
```

### 8.1 Field order in Props and destructuring

One order in all three places: **`type Props`**, **parameter destructuring**, **the JSX call**. That way the eye looks for the same thing the same way.

The order:

1. **Data** — string, number, boolean, objects, refs, `children`.
2. **Identifiers / styles** — `id`, `className`, `style`.
3. **Event handlers** — `onClick`, `onSubmit`, `onChange`, any `on<Event>`.

```ts
// ✓ OK
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
  onClick
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

The logic: "what we show" → "how it looks" → "what it does". Meaning first, then form, then behaviour.

Within each group the order is free, but **it must match in all three places** (Props ↔ destructuring ↔ JSX). A mismatch is caught at review.

---

## 9. Arrow functions: the body

**Every declaration (top-level and module-level) uses a block body with `return`.** One-line expression bodies are banned: `=> { return ... }` looks the same regardless of body size, and you never have to rewrite it when the logic grows.

```ts
// ✓ OK
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

// ✗ NOT OK
const readRole = (user: User | null): UserRole =>
  user?.app_metadata?.role === 'admin' ? 'admin' : 'user';
```

**Exceptions — keep the expression body:**

- **React components that return JSX directly** — the JSX is itself the "body", and a `{ return }` wrapper visually duplicates it:

  ```tsx
  // ✓ OK
  export const Avatar = ({ src }: Props) => <img src={src} />;

  export const Foo = (props: P) => (
    <div>
      <span>{props.text}</span>
    </div>
  );
  ```

- **Inline callbacks** (function arguments, JSX props, hook methods):

  ```ts
  // ✓ OK — this is an argument, not a declaration
  arr.map((x) => x.id);
  arr.filter((x) => x.active);
  pipe(xs, filter((x) => x > 0));
  useEffect(() => setOpen(true), []);
  <Button onClick={() => router.push('/foo')} />
  match(state).with('idle', () => null)
  ```

- **Primitives in `ui-kit/`** — they follow their own convention (PascalCase folders, SCSS modules, Base UI). See §2.1.

**Review rule:** if the arrow sits to the right of an `=` (a function declaration) — block body. If the arrow sits inside `(...)` or `{...}` (an argument) — your call, usually an expression.

### 9.5 `if` / `else` — always with braces

**The body of `if`, `else if` and `else` is always in `{}`, even for a single line.** A one-line `if (cond) doThing();` is banned: adding a second statement to a branch shouldn't require restructuring, diffs stay cleaner, and there is no "forgot the braces" trap. Held by hand and caught at review.

```ts
// ✓ OK
if (!isTauri()) {
  return;
}

if (isManual) {
  toast.success(t('upToDate'));
}

// ✗ NOT OK
if (!isTauri()) return;
if (isManual) toast.success(t('upToDate'));
```

A ternary that returns a value is still fine (it's an expression, not a statement): `return a ? b : c;`.

### 9.6 Independent `await` calls go in parallel

**Independent async calls go through `Promise.all`, not sequential `await`s.** Sequential `await`s add up the latency: two 200 ms requests become 400 ms instead of 200. Independence is easy to check: the second call does not use the first one's result.

```ts
// ✗ NOT OK — sequential, though the calls are independent
const user = await getUser(id);
const rooms = await getRooms(id);

// ✓ OK
const [user, rooms] = await Promise.all([getUser(id), getRooms(id)]);
```

**`Promise.allSettled` — when partial failure is acceptable.** `Promise.all` rejects as a whole on the first error; if a failing branch must not take the others down (notifications, optional analytics, cache warm-up), use `allSettled` and inspect `status` per result.

```ts
// ✓ OK — a failing push does not cancel the email
const results = await Promise.allSettled([sendEmail(userId), sendPush(userId)]);
```

**Keep them sequential** when the order matters:

- The second call consumes the first one's result (`const room = await getRoom(id); const members = await getMembers(room.id);`).
- The order is part of the logic: a permission check before a mutation, a write before a read, transaction steps.

---

## 10. React conventions

- Function components, arrow functions.
- `'use client'` in every file with hooks / state / event handlers.
- React Compiler is enabled — no `useMemo` / `useCallback` for micro-optimisation. Keep them only for a semantically stable ref (`useEffect` dependencies, a key in a Map).
- Event handlers are `on<Event>` in camelCase: `onSubmit`, `onSelectRoom`.
- React types are **named imports**: `import type { ComponentProps, ReactNode } from 'react'`. **`import type * as React from 'react'` is banned.**

### 10.1 Hook order

ESLint does not sort hooks — held by hand and caught at review.

Group order:

1. **Navigation** — `useRouter`, `usePathname`, `useSearchParams`, `useParams`.
2. **Store / context** — `useCurrentUser`, `useAuthStore`, any `use<Name>Store`.
3. **Data** — TanStack Query/Mutation hooks.
4. **State** — `useState`, `useReducer`.
5. **Ref** — `useRef`.
6. **Memo / callbacks** — `useMemo`, `useCallback`, `useTransition`, `useId`.
7. **Effects** — `useEffect`, `useLayoutEffect`.
8. **Derived const** — `const x = params.get(...)`, values unpacked from hooks.

A blank line between groups. No blank line within a group.

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

**Reordering rules:**

- Never move a hook across a data dependency: if `name` is needed by `useRoomToken({ roomName: name })`, `name` must come before the hook. When the group order conflicts with that, leave it as is and mark it `// data dep: name → query`.
- `if (...) useFoo()` is a `rules-of-hooks` bug — fix it, don't sort it.

**Custom hooks** are placed by what they do inside: `useRooms` (runs a `useQuery`) → the Data group; `useCurrentUser` (a context wrapper) → the Store group; `useDocumentTitle` (an effect) → the Effects group.

### 10.2 Hook / effect dependencies

A `useEffect` `deps` array holds only what **should actually re-trigger** the effect. If we know the effect needs a single `roomId`, we don't add `room`, `router` or mutation objects "to keep the linter quiet".

**Stable refs don't go into deps.** `router` from `next/navigation` and `reset` / `mutate` from react-query are stable across renders. Adding them is pointless — the effect must not react to them "changing". `// eslint-disable-next-line react/exhaustive-deps -- reason` with an explicit reason is normal practice, not a hack.

```tsx
// ✗ BAD — surplus deps, and the mutation object changes its ref every render
useEffect(() => {
  if (!roomId) router.replace(ROUTES.lobby);
}, [roomId, room, router, tokenMutation]);

// ✓ OK — only roomId triggers it, and the reason is recorded
// eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on roomId change; router is a stable ref
useEffect(() => {
  if (!roomId) router.replace(ROUTES.lobby);
}, [roomId]);
```

**Anti-pattern: `useEffect` + `mutate` to load data.** The mutation object in deps means a new ref every render, which means refetch loops. Do declarative loading with `useQuery` and a key (`queryKey: [roomId]`) — react-query refetches on a key change by itself, and neither `useEffect` nor `reset()` is needed.

### 10.3 Destructuring query / mutation results

The result of `useQuery` or a custom query hook is **destructured immediately** — don't carry the object around and don't reach through the dot:

```tsx
// ✗ BAD — dot access, the wrapper object is unnecessary
const roomById = useRoomById(roomId);
const room = roomById.data;
// ... roomById.isLoading, roomById.isError

// ✓ OK — destructured on the spot, renamed to say what it is
const { data: room, isLoading } = useRoomById(roomId);
const { data: publicTokenData, isError: publicTokenFailed } = usePublicRoomToken(roomId, enabled);
```

`data` is almost always renamed (`data: room`) — a bare `data` carries no meaning.

**Exception — `useMutation`.** Keep the mutation object whole: you need both the fields (`isPending`, `isError`, `error`, `data`) and the methods (`mutateAsync`, `reset`). Destructuring 5+ names reads worse, and the methods get called as `tokenMutation.reset()` anyway.

```tsx
// ✓ OK — the mutation stays an object
const tokenMutation = useRoomTokenMutation();
// ... tokenMutation.isPending, tokenMutation.mutateAsync(...), tokenMutation.reset()
```

### 10.4 Destructure wherever it simplifies

The principle: **destructure as much as you can** — for readability. If a value is reached through the dot 2+ times or arrives nested, pull it into a local variable. Less `obj.a.b` noise, and the names speak for themselves.

**Nested access — destructure the parent:**

```ts
// ✗ BAD — row.sender.X repeats
senderName: resolveDisplayName({
  displayName: row.sender.profile?.displayName,
  name: row.sender.name,
  email: row.sender.email,
  userId: row.senderId,
});

// ✓ OK — sender is pulled out once
const { sender, senderId } = row;
senderName: resolveDisplayName({
  displayName: sender?.profile?.displayName,
  name: sender?.name,
  email: sender?.email,
  userId: senderId,
});
```

**Function parameters: 2+ arguments → a single object with destructuring.** Positional arguments (especially same-typed ones — `string, string`) are easy to swap; an object is self-documenting and order-independent. Single-argument functions (`listFriends(userId)`) stay positional. The same rule applies on the server — see [`apps/server/CLAUDE.md`](../../apps/server/CLAUDE.md).

```ts
// ✗ BAD — 4 positional args, easy to mix up
resolveDisplayName(displayName, name, email, userId);

// ✓ OK — object parameter, destructured in the signature
resolveDisplayName({ displayName, name, email, userId });
```

**A repeated `obj.x` (2+) goes into a local variable / destructuring:**

```ts
// ✗ BAD
if (file.size === 0) ...;
if (file.size > MAX) ...;
const ext = extension(file.type);

// ✓ OK
const { size, type, name } = file;
if (size === 0) ...;
if (size > MAX) ...;
const ext = extension(type);
```

**When NOT to destructure:**

- A single access — `obj.x` once, destructuring is pointless ceremony.
- Context is lost — if a bare `name` doesn't say whose it is, keep `user.name` or rename (`const { name: senderName } = ...`).
- A stable namespace object (`router`, `console`, `Math`) — leave it alone.

---

## 11. The `model/`, `lib/`, `api/` segments

**`model/`** — hooks, Zustand stores, context providers, state types.

```
entities/room/model/
  hooks/                     ← a group of hooks
    index.ts                 ← hooks barrel
    use-enter-room.ts
    use-room-token.ts
  rooms-presence/            ← a subsystem = a folder
    index.ts                 ← barrel: { RoomsPresenceProvider, useRoomsPresence }
    rooms-presence-context.tsx
    use-rooms-presence-stream.ts
  types.ts                   ← the slice's public types (when used from outside)
  (no model/index.ts — barrels live at the subfolder level)
```

Files are kebab-case. Functions inside are camelCase.

**A subsystem gets a folder.** Provider + context + hook (or a hook plus 2+ modules used only by it) → a separate folder with an `index.ts` (e.g. `rooms-presence/`). A slice's hooks and contexts are grouped into `model/hooks/`, `model/contexts/` (see the barrel rule below). A completely flat `model/` (1-2 files, no subfolders) is fine for small slices.

**Grouping inside `model/`.** When a slice has many `model` files, group them into subfolders by nature (`model/contexts/`, `model/hooks/`, `model/stores/`, `model/lib/`) — see `features/room/room-control`, `widgets/chat/chat-panel`. This is organisation **inside** the `model/` segment, not a separate top-level `hooks/` segment (that one is banned, see below).

**The `model/` barrel rule.** Every `model/` subfolder gets its own `index.ts` (`model/hooks/index.ts`, `model/contexts/index.ts`, `model/stores/index.ts`). **Do NOT create a slice-level `model/index.ts`.** An import from outside a subfolder goes through that subfolder's barrel:

```ts
// ✓ OK
import { useRoomControls } from '../model/hooks';
import { DeafenProvider } from '../model/contexts';
// slice index.ts
export { useRoomControls } from './model/hooks';

// ✗ NOT OK
import { useRoomControls } from '../model/hooks/use-room-controls';  // deep, past the barrel
import { useRoomControls } from '../model';                          // model/index does not exist
```

Between files **inside the same subfolder**, import by file relatively (`./use-x`, `../types`), not through their own barrel (a self-import). `model/types.ts` is a file, not a folder: import it directly as `../model/types`, with no barrel. A flat `model/` (no subfolders, just `use-x.ts` + `types.ts`) needs no barrel — import by file.

**Types:**

- Types local to a single hook (`Props`, input/output, internal unions) live **in the same file**, not extracted.
- The slice's public types (used by other slices through the barrel) go in `model/types.ts`.
- If a subsystem folder has its own internal types — `model/<subsystem>/types.ts`.

Do not create a separate `types/` or `hooks/` segment — that splits by file shape rather than by the nature of the code (an FSD anti-pattern).

**`lib/`** — pure functions with no React dependencies:

```
entities/room/lib/
  cache.ts          ← readRoomTokenCache / writeRoomTokenCache
  validation.ts     ← isRoomNameValid
  group-rooms.ts    ← filtering + sorting of collections
```

If a function returns JSX it's a component — move it to `ui/`.

**One file per task, a folder per cluster.** While a function has no companions it lives as a flat file — `lib/group-rooms.ts`. The moment its own type, a test, or a second module used only by it appears next to it, create a folder and put them together:

```
shared/lib/build-room-href/            ✓ the function, its type and its test sit together
  build-room-href.ts
  build-room-href.types.ts
  index.ts
  _tests/build-room-href.test.ts

shared/lib/
  build-room-href.ts                   ✗ two files of one function scattered
  build-room-href.types.ts               through the segment's common pile
```

The reason is simple: types and tests are read together with the implementation, not found by searching the directory. A flat `<fn-name>.types.ts` next to a flat `<fn-name>.ts` is already the signal to create a folder. The same rule holds in `shared/lib/` and in the server's `src/lib/` (see `code-style-server.md` §3).

The exception is `model/hooks/`, `model/contexts/`, `model/stores/`: files there deliberately sit flat under a shared barrel, because the segment itself already does the grouping. A hook gets its own folder only once it has its own `.types.ts` and tests.

**`lib/` vs `model/` heuristic:** a function uses React (`useState`, `useEffect`, context) → `model/`. Pure (takes arguments, returns a value) → `lib/`. Error classes, parsers, mappers → `lib/`. A set of settings values / constants → `config/`.

**`api/` inside a slice** — integration with an external service tied to the slice's domain: subscriptions, mappers, service-specific wrappers. The difference from `model/` is that `api/` is the I/O boundary (network, realtime, push service), while `model/` holds hooks and state types.

```
entities/user/
  api/
    auth-bridge.ts   ← subscribeAuth: subscription to authClient.useSession / onAuthStateChange
  model/
    use-current-user.ts
    types.ts
```

Heuristic: code that **listens to / sends to** an external service → `api/`. Code that **reads / derives** domain state → `model/`. A project-agnostic RPC client (not tied to a domain) → `shared/api/` (below).

**`api/` in `shared/`** — axios wrappers per domain:

```text
shared/api/
  http/      ← axios instance: baseURL, Bearer token, error normalisation
  rooms/     ← listRooms / createRoom / deleteRoom
  livekit/   ← fetchLiveKitToken
  auth/      ← better-auth client (authClient, getAuthToken, clearToken)
  index.ts
```

HTTP goes through the shared axios instance from `shared/api/http`. A manual `fetch` is not needed: the instance already attaches `Authorization` and unwraps the server's `{ error }` into `Error(message)`.

```ts
import { api } from '../http';

import type { CreateRoomRequest, Room } from '@chatovo/schemas';

export const createRoom = async (input: CreateRoomRequest): Promise<Room> => {
  const { data } = await api.post('/rooms', input);

  return data;
};
```

Request/response types come from `@chatovo/schemas` (the same contract NestJS validates against). The function returns `data`, and errors fly as exceptions — React Query catches them.

---

## 12. Global styles and SCSS

- Theme tokens are CSS variables in `app/globals.scss` (`:root` + `.dark`).
- Dark theme is hardcoded as `<html className="dark">` (incompatible with `next-themes` + Tauri).
- Theme tokens, spacing and sizes live in `ui-kit/styles/_tokens.scss` (`--space-*`, `--icon-*`, `--control-*`, colours, radii). Wired in through `app/globals.scss`.
- Component styles are `*.module.scss`; shared mixins come from `@use '@/ui-kit/styles/mixins' as *` (`loadPaths` + `turbopack.resolveAlias` in `next.config.ts`).
- `clsx` joins module classes with the `className` prop.

---

## 13. Blank lines between logical steps

ESLint does not autofix `padding-line-between-statements`. Held by hand.

**A blank line before:**

- `return` (unless it's the first statement)
- `throw`
- `if` (an early-return guard or branching)
- an `await` followed by a logically separate step
- `try` / `for` / `while` / `switch`

**After an `if` block** — a blank line before the next statement.

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
// ✓ multiple returns
if (!name) return null;

if (query.isLoading) {
  return <Loader />;
}

return <VoiceRoom />;
```

**Exceptions** (no blank line needed):

- A single statement in a block.
- Uniform single-line guards in a row:
  ```ts
  if (!a) return null;
  if (!b) return null;
  if (!c) return null;
  ```
- Consecutive `const`s belonging to one logical block.

---

## 14. Shared schemas — `@chatovo/schemas`

Zod schemas and types shared by client and server live in `packages/schemas`:

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
// ✓ OK
import { createRoomInputSchema, type Room } from '@chatovo/schemas/rooms';

// ✗ NOT OK
import { Room } from '@/shared/api';
```

`@/shared/api` exports only runtime functions (RPC wrappers, the better-auth client).

**FormValues vs Request types.** One zod schema yields two types — `.default()` / `.transform()` make `z.input` and `z.output` incompatible:

- `CreateRoomFormValues = z.input<typeof schema>` — the shape of the data **before** validation, for the form's `defaultValues`.
- `CreateRoomRequest = z.output<typeof schema>` — the shape **after** validation (defaults applied, transforms run), for submit / the API body.

This axis is "validation stage", not "HTTP request/response". An entity's response type is separate (`Room`), not the `z.output` of an input schema.

---

## 15. Forms — react-hook-form + zodResolver

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
  defaultValues: DEFAULT_VALUES
});
```

- The schema lives in `@chatovo/schemas/<resource>`, never inline in the form.
- Server-side errors go through `setError('field', { message: err.message })`.
- Boolean toggles outside a form use `useBoolean` from `@siberiacancode/reactuse`, not `useState`.

---

## 16. Conditional render — ts-pattern

3+ render branches → `match`, not nested `if (...) return <X />` and not ternary chains in JSX.

What to match on — two options, both fine:

**A. On a discriminated union from a hook.** The hook assembles a `state` union, the view only does `match`. Pick this when the assembly logic is bulky or reused:

```tsx
import { match } from 'ts-pattern';

return match(state)
  .with({ kind: 'loading' }, () => <RoomLoadingFallback />)
  .with({ kind: 'active' }, ({ token, url }) => <VoiceRoom token={token} serverUrl={url} />)
  .exhaustive();
```

`.exhaustive()` gives a TS error if you add a union variant and forget the case.

**B. On an object of raw hooks.** `match` directly on `{ ...hook fields }`, with patterns like `P.nullish` / `P.string`. Pick this when there are few branches, the logic is compact, and a separate hook layer would be pointless ceremony:

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

The order of `.with` matters — the first matching pattern wins. Take narrowed values in
handlers from the `match` argument (it is narrowed), not from the closure and not via `as` — a
cast bypasses type checking.

**Banned either way** — `if` / ternary chains that assemble JSX:

```tsx
// ✗ NOT OK — condition hell in the view
return !roomId ? null : roomById.isLoading ? <Loading /> : !room ? <NotFound /> : <Room />;
```

**When to extract into a hook:** the state assembly is reused in 2+ places, or the logic body
is so bulky that the view stops reading. Otherwise option B inline in the view is the norm.

### 16.1 A single branch — `&&`, not `? : null`

A "present/absent" render (one branch, otherwise nothing) uses `cond && <X />`, not `cond ? <X /> : null`:

```tsx
// ✗ NOT OK — the : null is redundant
{isAdmin ? <span className={s.badge}>admin</span> : null}
{room.isPrivate ? <Lock /> : null}

// ✓ OK
{isAdmin && <span className={s.badge}>admin</span>}
{room.isPrivate && <Lock />}
```

The inverse `cond ? null : <X />` becomes `!cond && <X />`.

**The condition must be a `boolean`.** `&&` renders the left operand as-is — for a
non-boolean falsy value (`0`, `''`, `NaN`) that prints garbage (a stray `0` in the markup).
Numeric and string checks must be coerced to boolean first:

```tsx
// ✗ DANGEROUS — renders "0" on an empty array
{participants.length && <List />}

// ✓ OK — an explicit boolean check
{participants.length > 0 && <List />}
{!isEmpty(participants) && <List />}   // isEmpty from remeda
```

Safe as a condition: boolean flags (`isActive`), comparisons (`x === y`),
`!x`, `!!x`, an object / `undefined` (`errors.name`), `isEmpty()` / `isNonNullish()`.

The ternary stays for **two** real branches (`cond ? <A /> : <B />`).

---

## 17. Drill cleanup

If the data is reachable through a global hook, the leaf takes it itself instead of accepting props:

```tsx
// ✗ BAD — drilling
<ChannelsList displayName={x} isAdmin={z} rooms={r} onDelete={d} />

// ✓ OK
const ChannelsList = () => {
  const rooms = useRooms();
  const { displayName, isAdmin } = useCurrentUser();
  // ...
};
```

**Don't build generic parameterised components** for static content:

```tsx
// ✗ NOT OK — text is always the same
<RoomLoader text="Loading room..." />

// ✓ OK
<RoomLoadingFallback />   // the text lives inside
<RoomConnecting displayName="x" /> // only the dynamic part
```

**Keep props when:**

- The data comes from a `.map` (`<ChannelsRoomItem room={room} />`).
- It's the orchestrator's UI state (`channelsOpened` in `AppSidebar`).
- The callback needs the parent's context.

---

## 18. Comments and JSDoc

**Application code carries no comments.** In `views/`, `widgets/`, `features/`, `entities/` (client) and `modules/` (server) we write no `//`, no block comments and no JSDoc: the code documents itself through names. If a block needs a comment to explain it, the block should be extracted into a function with a telling name.

**Narrow exception — the public surface of reusable modules:** `ui-kit`, `shared/lib`, `shared/hooks` (client), `src/lib/` (server), `packages/schemas`. An **exported** primitive may carry a short JSDoc — one or two lines — **when the signature does not explain the purpose**: non-obvious units, a side effect, edge-case behaviour, a non-trivial return contract.

```ts
// ✓ OK — an export from shared/lib whose contract isn't readable from the signature
/** Returns `null` if the user cancelled the file picker dialog. */
export const pickAvatarFile = async (): Promise<File | null> => {
  ...
};

// ✗ NOT OK — the JSDoc just restates the signature
/** Formats bytes into a string. */
export const formatBytes = (bytes: number): string => {
  ...
};
```

**Internal helpers are never documented** — not in `shared/`, not anywhere else. The rule covers only what leaves through a barrel.

The exception does not lift the other bans: commented-out code, a `// TODO` with no ticket, and placeholder comments are banned everywhere. Technical directives are legitimate — `eslint-disable-next-line ... -- reason` (§10.2), `@ts-expect-error` with a reason, `'use client'`.

---

## 19. Server — see apps/server/CLAUDE.md

This guide covers `apps/client/`. The API conventions (NestJS modules, `createZodDto` from `nestjs-zod`, the global `AuthGuard` + `@AllowAnonymous()`, the WebSocket gateway, domain events) are described in [`apps/server/CLAUDE.md`](../../apps/server/CLAUDE.md) — the single source of truth for the server.

---

## 20. Bans

- `console.log` in a commit. Rule `no-console` (`**/scripts/**` — off).
- `any` — rule `ts/no-explicit-any`. Use `unknown`.
- A non-null assertion `!` without justification — rule `ts/no-non-null-assertion`.
- Deep imports past a barrel.
- Cross-imports between slices of the same layer.
- CSS-in-JS. SCSS modules only.
- A manual `fetch` / your own `axios.create` for business calls. Only the shared instance from `shared/api/http`.
- Duplicating schemas between client and server. Only `@chatovo/schemas`.
- `useState` for form fields. Only `react-hook-form`.
- Nested `if (...) return <X />` across 3+ branches. Use `ts-pattern match`.
- Prop drilling when the leaf can call the hook itself.

---

## 21. Pre-commit checklist

```bash
bun run fix                                # ESLint --fix + Prettier + Stylelint --fix
bun run verify                             # typecheck + lint + format:check + lint:css
bun --filter @chatovo/client build          # client build
bun --filter @chatovo/server build          # server build
```

`bun run fix` does not fix: blank lines (§13), hook order (§10.1), FSD import boundaries (→ [`docs/architecture/fsd.md`](../architecture/fsd.md)).
