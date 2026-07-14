# CLAUDE.md — apps/server

Guidance for Claude Code when working in the API. Extends the root [../../CLAUDE.md](../../CLAUDE.md) (incl. the DB-schema note, `bun db:push`); root rules still apply.

API — **NestJS 11 on the Bun runtime** + **Prisma** (self-hosted Postgres) + **better-auth** (Bearer tokens). Realtime media via **LiveKit** SFU with server-issued JWTs. Bun runs the TypeScript source directly (no compile step); Nest provides DI + module structure.

## Layout

```
src/
├── main.ts             # bootstrap: NestFactory, global pipe/filter, CORS, helmet, pino, swagger, WS adapter, shutdown hooks
├── app.module.ts       # root module: imports every feature module + global infra modules
├── config/             # env schema (Zod) + AppConfigModule/AppConfigService, cors, livekit, uploads
├── core/               # Prisma: base-prisma (raw client for better-auth), prisma.service (PrismaClient subclass), prisma.module (@Global)
├── common/             # cross-cutting infra grouped by kind: filters/, decorators/, events/ (domain event catalogue)
├── lib/                # cross-module domain helpers: guards.ts, selectors.ts, friend-tag.ts (no transport, no Nest deps)
└── modules/            # one feature module per domain (see convention below)
```

## Module convention (follow this exactly for every feature)

Each feature is a folder under `modules/<name>/` laid out the Nest way:

```
modules/rooms/
├── rooms.module.ts       # @Module — declares controllers + providers, imports deps, exports the service if others need it
├── rooms.controller.ts   # transport only: @Controller, route decorators, @Body/@Param/@Query, calls the service
├── rooms.service.ts      # @Injectable — business logic. Plain methods, returns data or throws Nest HttpException subclasses
└── dto/
    └── rooms.dto.ts      # createZodDto(...) classes built from @chatovo/schemas Zod schemas
```

Bigger modules keep the same shape with extra segments: `mappers.ts`, `<name>.listener.ts` (event handlers), `handlers/` for a gateway's message handlers, in-memory `*-store.ts`. Match the existing neighbours.

**Layering rule:**
- **controller** — transport only: validated input in (`@Body() dto`), a service call, a return value out. No Prisma, no business rules. Let the return value serialize; don't hand-build responses.
- **service** — business logic. Injects `PrismaService` (call models directly: `this.prisma.<model>`), other services, `AppConfigService`, `EventEmitter2`. Takes plain args (no `Request`), returns data or **throws** `ConflictException` / `NotFoundException` / `ForbiddenException` / `BadRequestException` from `@nestjs/common`. Never build error responses — the global `AllExceptionsFilter` turns thrown errors into `{ error: string }`.
- Reusable guards (`assertRoomExists`, `assertCanManageRoom`, `getUserWithProfileOrThrow`) and Prisma selects (`roomSelect`, `senderSelect`) live in [lib/](src/lib/) — don't re-declare per module. These are plain functions using `basePrisma`, not providers.

## Validation & OpenAPI — Zod is the single source of truth

- DTOs are **`createZodDto(schema)`** from **`nestjs-zod`**, where `schema` comes from **`@chatovo/schemas`**. One schema drives request validation AND the OpenAPI doc AND the client's form validation. **Never** add `class-validator` / `class-transformer` DTOs — they would fork the contract the client already validates against with `zodResolver`.
- `ZodValidationPipe` is registered globally in `main.ts`; a bad body yields `{ error: "..." }` automatically.
- OpenAPI: `@nestjs/swagger` at `/docs` (+ `/docs-json`). `patchNestJsSwagger()` is not exported in nestjs-zod v5 — use `cleanupOpenApiDoc(...)` around `SwaggerModule.createDocument(...)`. Annotate responses with `@ZodResponse({ type: SomeDto })` where a typed response matters.

## Auth (better-auth)

- The better-auth instance lives in [modules/auth/auth.ts](src/modules/auth/auth.ts) as a module-level singleton (built from validated env; used by the CLI, the WS gateway, and `AuthModule.forRoot({ auth })`). It uses `basePrisma` (the raw client), not `PrismaService`.
- `@thallesp/nestjs-better-auth` registers a **global `AuthGuard`** — every route is protected by default (fail-closed). Open a route with **`@Public()`**; make auth optional with `@OptionalAuth()`. Read the session with the **`@Session()`** param decorator (`UserSession`). This replaces the old `authMiddleware` + `.use('/x/*', ...)` prefix wiring; there is no per-prefix middleware anymore.
- Body parser is disabled at bootstrap (`NestFactory.create(AppModule, { bodyParser: false })`) so better-auth reads the raw body; `express.json()` is re-applied for the rest of the API.

## Realtime

Single app WebSocket at `/realtime` (auth via `?token=`), implemented as a **`@WebSocketGateway`** on `@nestjs/platform-ws` (`WsAdapter`) — no SSE, no socket.io. `connection-store.ts` tracks sockets; domain events fan out through it. Presence is split: [livekit/presence-store.ts](src/modules/livekit/presence-store.ts) is the pure in-memory store + pub/sub; [livekit/presence.ts](src/modules/livekit/presence.ts) holds the LiveKit-SDK reconcile logic.

In-memory stores (`connection-store`, `presence-store`, `call-store`) and `emit.ts` stay **plain modules, not providers** — they carry no request state and their existing `bindRealtimeBroadcast` indirection deliberately breaks the `friends ↔ connection-store` import cycle. Don't drag them into DI.

## Side effects via domain events

Domain services do **not** import Telegram / email / push. They inject `EventEmitter2` and emit a typed event from [common/events.ts](src/common/events.ts) (e.g. `DomainEvent.RoomCreated`); a `*.listener.ts` in the notifications side handles it and owns its own try/catch. This keeps domain modules transport-agnostic and stops a failing notification from crashing the request (no more fire-and-forget `.then()` without `.catch()`).

## Prisma

- `PrismaService` (in `core/`) is a plain `PrismaClient` subclass (Nest recipe) with `onModuleInit`/`onModuleDestroy` for connect/disconnect. Inject it and call models directly: `this.prisma.<model>`. No `$extends`, no global error mapping — services validate conflicts explicitly (e.g. `assertRoomNameAvailable` before a create/rename) and throw the right `HttpException`.
- `basePrisma` (raw, no mapping) is for better-auth only. Don't use it in feature services.
- Schema split per domain in `prisma/schema/*.prisma` (`auth`, `room`, `message`) + `prisma/base.prisma`. Models: `User`/`Session`/`Account`/`Verification` (better-auth), `Profile` (1-1 FK to user), `Room`, `Message`.

## Ops baked in

- **Config**: `AppConfigService.get('KEY')` — typed, Zod-validated at boot (fails fast). Don't read `process.env` directly in feature code.
- **Rate limiting**: `@nestjs/throttler` — strict on `/auth/*` and `/feedback`, looser elsewhere.
- **Health**: `@nestjs/terminus` at `/health` actually pings Postgres (docker healthcheck depends on it).
- **Logging**: `nestjs-pino` (structured JSON + request id; `pino-pretty` in dev).
- **Shutdown**: `app.enableShutdownHooks()` — `PrismaService.onModuleDestroy` closes the pool; the gateway closes sockets.

## Commands (from apps/server/)

```bash
bun dev                # bun --watch (full restart on change; Nest DI can't hot-swap)
bun db:push            # apply schema diff (preferred for local iteration)
bun db:studio          # Prisma Studio
bun x tsc --noEmit     # typecheck (also: bun --filter @chatovo/server typecheck)
```

> Don't add `@nestjs/cli` / SWC — Bun runs the TS directly, there is no `nest build` / `dist`. Don't add `@nestjs/config`'s raw `ConfigService` reads in feature code; go through `AppConfigService`.
