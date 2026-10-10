---
paths:
  - 'apps/server/**/*.ts'
---

<!-- Compressed editing rules, loaded automatically when a server file is edited. -->
<!-- The full reasoning is docs/guides/server/nestjs.md; keep them in sync. -->

# Server — domain events and realtime

Domain services never import Telegram / email / push. They emit a typed event from `common/events/domain-events.ts` through `EventEmitter2`; a `*.listener.ts` in `modules/notifications/` handles it inside its own try/catch. Plain modules use `emitDomainEvent`. A fire-and-forget `.then()` without `.catch()` is banned.

Realtime is one `@WebSocketGateway` at `/realtime` (`WsAdapter`). The in-memory stores (`connection-store`, `presence-store`, `call-store`) and `emit.ts` stay plain modules, not providers — `bindRealtimeBroadcast` breaks the import cycle on purpose.
