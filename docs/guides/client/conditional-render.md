# Conditional render

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

## 16.1 A single branch — `&&`, not `? : null`

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
