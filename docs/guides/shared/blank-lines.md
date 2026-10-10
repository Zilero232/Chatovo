# Blank lines between logical steps

Neither the `@siberiacancode/eslint` preset nor Prettier enforces `padding-line-between-statements`, so this is held by hand and caught at review.

**A blank line before:**

- `return` (unless it's the first statement)
- `throw`
- `if` (an early-return guard or branching)
- an `await` followed by a logically separate step
- `try` / `for` / `while` / `switch`

**After an `if` block** — a blank line before the next statement.

```ts
// ✓
const trimmed = name.trim();

if (!trimmed) {
  throw new Error('Room name required');
}

const room = await createRoom({ name: trimmed });

router.push(`/room?id=${room.id}`);
```

```ts
// ✓ multiple returns
if (!name) {
  return null;
}

if (query.isLoading) {
  return <Loader />;
}

return <VoiceRoom />;
```

**Exceptions** (no blank line needed):

- A single statement in a block.
- Consecutive `const`s belonging to one logical block.
