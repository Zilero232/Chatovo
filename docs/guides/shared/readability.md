# Readability — destructuring

## 10.4 Destructure wherever it simplifies

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

Function parameters follow the same idea — 2+ arguments become one object: [functions](functions.md#object-parameters).

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
