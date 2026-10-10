# The `model/`, `lib/` and `api/` segments

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

The reason is simple: types and tests are read together with the implementation, not found by searching the directory. A flat `<fn-name>.types.ts` next to a flat `<fn-name>.ts` is already the signal to create a folder. The same rule holds in `shared/lib/` and in the server's `src/lib/` (see [NestJS modules](../server/nestjs.md#nothing-but-the-class)).

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
