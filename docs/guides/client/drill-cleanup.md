# Drill cleanup

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
