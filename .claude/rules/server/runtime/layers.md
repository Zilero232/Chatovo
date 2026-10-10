---
paths:
  - 'apps/server/**/*.ts'
---

<!-- Compressed editing rules, loaded automatically when a server file is edited. -->
<!-- The full reasoning is docs/guides/server/nestjs.md; keep them in sync. -->

# Server — layers, errors, config

- **Controller** — validated input, one service call, the value out. No Prisma, no business rules, no hand-built responses.
- **Service** — business logic; plain arguments (never a `Request`); returns data or throws `ConflictException` / `NotFoundException` / `ForbiddenException` / `BadRequestException`. `AllExceptionsFilter` turns it into `{ error }`.
- Every route is authenticated by default (global `AuthGuard`); open one with `@AllowAnonymous()`, read the session with `@Session()`. Admin checks are `assertIsAdmin` inside the service.
- Config only through `AppConfigService.get('KEY')` — never `process.env` in feature code.
- Don't parallelise a guard and the mutation it protects.
