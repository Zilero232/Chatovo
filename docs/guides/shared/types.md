# Types

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

## 8.1 Field order in Props and destructuring

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
