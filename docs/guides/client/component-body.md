# Component body order

## 10.1a Component body order

After the hooks, the rest of the body follows one fixed order. It reads top-down as "what I have → what I derived → what I do → what I render".

1. **Hooks** — in the group order of [React §10.1](react.md#101-hook-order).
2. **Derived const** — plain values computed from hook results (`const isOwner = room.ownerId === user.id`).
3. **Early returns** — guards that render `null` / a fallback.
4. **Handlers and local functions** — `handleSubmit`, `renderRow`, anything the JSX calls.
5. **`return`** — the JSX.

A blank line between the blocks.

```tsx
export const RoomHeader = ({ roomId }: RoomHeaderProps) => {
  const { user } = useCurrentUser();

  const { data: room, isLoading } = useRoomById(roomId);

  const [isEditing, setIsEditing] = useState(false);

  const isOwner = room?.ownerId === user?.id;

  if (isLoading) {
    return <RoomHeaderSkeleton />;
  }

  const handleRename = (name: string) => {
    renameMutation.mutate({ roomId, name });
    setIsEditing(false);
  };

  return <header>{/* ... */}</header>;
};
```

**Never interleave.** A handler declared between two hooks, or a `const` computed after the handlers that the handlers themselves use, forces the reader to jump around the body.

```tsx
// ✗ a handler wedged between hooks, and a derived const after it
const [open, setOpen] = useState(false);

const handleToggle = () => setOpen((prev) => !prev);

const { data: room } = useRoomById(roomId);
```

Pure helpers that need nothing from the render scope do not belong in the body at all — they are module-level in `lib/` ([segments](segments.md)).
