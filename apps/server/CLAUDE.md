# CLAUDE.md — apps/server

Guidance for Claude Code when working in the API. Extends the root [../../CLAUDE.md](../../CLAUDE.md) (incl. the DB-schema note, `bun db:push`); root rules still apply.

API — **Hono on Bun** + **Prisma** (self-hosted Postgres) + **better-auth** (Bearer tokens). Realtime media via **LiveKit** SFU with server-issued JWTs.

## Layout

```
src/
├── index.ts        # app entry: router wiring, CORS, global onError, OpenAPI/Swagger
├── core/           # infra: env validation (Zod), Prisma client + global error-mapping
├── config/         # constants: cors, livekit (token TTL, ping), uploads (size limits)
├── middleware/     # auth (Bearer→session), livekit-gate
├── lib/            # cross-module helpers: guards.ts, selectors.ts  (shared, no transport)
├── shared/         # OpenAPI errorSchema, Env type
└── modules/        # one folder per domain (see below)
```

## Module convention

Each module is `routes.ts` (OpenAPI route defs) + `handlers.ts` (transport) + `<name>.service.ts` (business logic) + `index.ts` (router), plus optional `mappers.ts` / `profile.ts`.

**Layering rule:**
- `handlers.ts` — transport only: read `c.req.valid(...)`, call a service, `c.json(...)`. No Prisma, no business rules.
- `<name>.service.ts` — business logic. Takes plain args (no Hono `c`), returns data or **throws `HTTPException`**. The global `onError` in [index.ts](src/index.ts) turns thrown errors into HTTP responses — services never `return c.json` for errors.
- Reusable guards (`assertRoomExists`, `assertCanManageRoom`, `getUserWithProfileOrThrow`) and Prisma selects (`roomSelect`, `senderSelect`) live in [lib/](src/lib/) — don't re-declare per module.

Modules: `auth` (better-auth instance), `chat`, `email` (SMTP via nodemailer + React Email templates rendered to HTML), `feedback`, `friends`, `github`, `livekit`, `push` (FCM), `realtime` (app WebSocket), `rooms`, `telegram`, `uploads` (disk + `/uploads` serving), `users`.

**Realtime:** a single app WebSocket at `/realtime` ([realtime/handlers/ws.ts](src/modules/realtime/handlers/ws.ts), auth via `?token=`) — no SSE, no socket.io. `realtime/connection-store.ts` tracks sockets, [realtime/emit.ts](src/modules/realtime/emit.ts) exposes `emitRoomEvent`/`emitUserEvent`. On open the server pushes `presence.snapshot` + `friends.snapshot`; chat/friends/presence events fan out through the same socket (`chat` module emits after DB write via [chat/emit-chat-event.ts](src/modules/chat/emit-chat-event.ts)).

**LiveKit specifics:** presence is split — [presence-store.ts](src/modules/livekit/presence-store.ts) is the pure in-memory store + pub/sub; [presence.ts](src/modules/livekit/presence.ts) holds the LiveKit-SDK reconcile logic and re-exports the store API.

## Prisma

Schema split per domain in `prisma/schema/*.prisma` (`auth`, `room`, `message`) + `prisma/base.prisma`. Models: `User`/`Session`/`Account`/`Verification` (better-auth), `Profile` (1-1 FK to user), `Room`, `Message`.

## Commands (from apps/server/)

```bash
bun db:push            # apply schema diff (preferred for local iteration)
bun db:studio          # Prisma Studio
bun x tsc --noEmit     # typecheck (no script)
```
