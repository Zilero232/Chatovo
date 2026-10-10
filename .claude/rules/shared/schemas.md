---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
  - 'packages/schemas/**'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/schemas.md; keep them in sync. -->

# Shared schemas — `@chatovo/schemas`

Every contract shared by client and server is a Zod 4 schema in `packages/schemas`, grouped by domain. Duplicating one is banned; the type is `z.infer`.

One schema yields two types: `z.input` is the shape before validation (a form's `defaultValues`), `z.output` the shape after (submit, the API body). An entity's response type is separate.

The server wraps it with `createZodDto(schema)`; the client validates with `zodResolver(schema)`.
