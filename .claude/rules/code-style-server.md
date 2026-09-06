---
paths:
  - "apps/server/**/*.ts"
---

<!-- COMPRESSED editing version: auto-loads when editing files under apps/server (paths frontmatter). -->
<!-- Full module convention — apps/server/CLAUDE.md; shared code style — docs/guides/style.md. Keep in sync when a rule changes. -->

# Code Style — server (NestJS 11 on Bun + Prisma)

Extends the shared `code-style.md`. The full convention for modules, auth, realtime and ops — `apps/server/CLAUDE.md`.

## 1. Module structure

```
modules/rooms/
├── index.ts                    # public API — Module + services for injection
├── rooms.module.ts
├── rooms.controller.ts         # transport only
├── services/
│   ├── index.ts
│   ├── rooms.service.types.ts  # <Fn>Input
│   └── rooms.service.ts
└── dto/rooms.dto.ts            # createZodDto(...) from @chatovo/schemas
```

`services/` always, even for a single service — one file per work domain, not a fat `<name>.service.ts` at the module root. A cross-module import goes only through the barrel (`from '../realtime'`), never deep (`from '../realtime/emit'`). Controllers and DTOs are not exported outwards.

## 2. Layers

- **Controller** — validated input (`@Body() dto`), a service call, a returned value. No Prisma and no business rules. Don't assemble the response by hand — let it serialise.
- **Service** — business logic. Injects `PrismaService` (`this.prisma.<model>`), other services, `AppConfigService`, `EventEmitter2`. Takes plain arguments (never a `Request`), returns data or **throws** `ConflictException` / `NotFoundException` / `ForbiddenException` / `BadRequestException`. We never construct error responses — the global `AllExceptionsFilter` turns a throw into `{ error: string }`.
- **lib/** — reusable guard functions (`assertRoomExists`, `assertCanManageRoom`) and Prisma selects (`roomSelect`, `senderSelect`). Plain functions over `basePrisma`, not providers. Do not redeclare them in modules.

## 3. Signatures

**2+ parameters → a single object**, typed `<Fn>Input` in `<module>.service.types.ts`. Single-argument functions (`listFriends(userId)`) stay positional. Same rule on the client — shared `code-style.md` §2.

A service or controller file holds **nothing but the class**. Constants → `config/<name>.config.ts`. Pure functions → `lib/<fn-name>/` (a folder per function: `<fn-name>.ts` + `index.ts` + `<fn-name>.types.ts` when there are 2+ parameters).

## 4. Validation

DTOs are only `createZodDto(schema)` from `nestjs-zod`, with the schema from `@chatovo/schemas`. `class-validator` / `class-transformer` are banned: they would fork a contract the client already validates through `zodResolver`. One schema = request validation + OpenAPI + form validation on the client.

## 5. Independent `await` calls go in parallel

As in the shared rule: the second call does not use the first one's result → `Promise.all`.

**On the server the order matters more often — don't parallelise:** a guard before a mutation (`assertCanManageRoom` → `delete`), an existence check before a related read, a write before reading the same data, transaction steps. Independent reads can be parallelised.

```ts
// ✗ do NOT parallelise — the guard must run before the mutation
await assertCanManageRoom({ roomId, userId });
await this.prisma.room.delete({ where: { id: roomId } });
```

## 6. Side effects go through domain events

Domain services do not import Telegram / email / push. They inject `EventEmitter2` and emit a typed event from `common/events/domain-events.ts`; a `*.listener.ts` in `modules/notifications/` handles it and keeps its own try/catch. Flat modules without DI (`call-store`, `emit-chat-event`) go through `emitDomainEvent`.

A fire-and-forget `.then()` without a `.catch()` is banned.

## 7. Prisma

`PrismaService` is a subclass of `PrismaClient`, injected, with models called directly. No `$extends` and no global error mapping: conflicts are checked explicitly (`assertRoomNameAvailable` before a create/rename) and throw the appropriate `HttpException`. `basePrisma` is for better-auth only, never in feature services.

## 8. Local differences from the client style

- `import type` is not enforced (`ts/consistent-type-imports` is off for `apps/server/**`) — Nest resolves dependencies from decorator metadata.
- Decorators (`@Injectable`, `@Controller`, `@AllowAnonymous`, `@Session`) are not "comments"; the no-comments rule does not apply to them.
- `process.env` in feature code is banned — only `AppConfigService.get('KEY')`.

## 9. Comments

As in the shared rule: `modules/` is application code, so no comments. The narrow exception is a short JSDoc on **exported** helpers in `src/lib/`, when the signature does not explain the contract. Internal functions are not documented.
