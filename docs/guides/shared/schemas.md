# Shared schemas — `@chatovo/schemas`

Zod schemas and types shared by client and server live in `packages/schemas`:

```
packages/schemas/src/
  rooms/
    inputs.ts    ← createRoomInputSchema
    outputs.ts   ← roomSchema
    types.ts     ← Room, CreateRoomInput, CreateRoomRawInput
    index.ts
  livekit/
    ...
```

```ts
// ✓ OK
import { createRoomInputSchema, type Room } from '@chatovo/schemas/rooms';

// ✗ NOT OK
import { Room } from '@/shared/api';
```

`@/shared/api` exports only runtime functions (RPC wrappers, the better-auth client).

**FormValues vs Request types.** One zod schema yields two types — `.default()` / `.transform()` make `z.input` and `z.output` incompatible:

- `CreateRoomFormValues = z.input<typeof schema>` — the shape of the data **before** validation, for the form's `defaultValues`.
- `CreateRoomRequest = z.output<typeof schema>` — the shape **after** validation (defaults applied, transforms run), for submit / the API body.

This axis is "validation stage", not "HTTP request/response". An entity's response type is separate (`Room`), not the `z.output` of an input schema.
