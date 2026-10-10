# Slice structure

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
