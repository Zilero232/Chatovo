---
paths:
  - 'apps/server/**/*.ts'
---

<!-- Compressed editing rules, loaded automatically when a server file is edited. -->
<!-- The full reasoning is docs/guides/server/nestjs.md; keep them in sync. -->

# Server — module shape

NestJS 11 on Bun; no build step, no `@nestjs/cli`.

`modules/<name>/`: `index.ts` (public API: the Module + injectable services) + `<name>.module.ts` + `<name>.controller.ts` + `services/` (always, one file per domain of work, inputs in `<module>.service.types.ts`) + `dto/`. Another module is imported through its barrel only (`from '../realtime'`). Controllers and DTOs aren't exported.

A service or controller file holds only the class: constants → `config/`, pure functions → `lib/<fn-name>/`. Cross-module guards and selects (`assertCanAccessRoom`, `roomSelect`) live in `src/lib/` as plain functions — never re-declared per module.

## DTOs

`createZodDto(schema)` from `nestjs-zod` with the schema from `@chatovo/schemas`. `class-validator` / `class-transformer` are banned.
