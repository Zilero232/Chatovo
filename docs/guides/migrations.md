# Database migrations

The project ran on `prisma db push` for a long time and had no migration history. It now has one, created as a baseline in September 2026 when better-auth 1.7 added a required `issuer` column to `account`.

## Layout

```text
apps/server/prisma/
├── base.prisma                 # generator + datasource
├── schema/                     # models, split per domain (auth, room, message)
└── migrations/
    ├── migration_lock.toml
    ├── 20260901000000_init/    # baseline — the schema as it stood before migrations existed
    └── 20260901000001_.../     # every change since
```

The baseline was generated from the live database, not from an empty one, and marked applied with `prisma migrate resolve --applied`. It was never executed against an existing environment — running it would try to create tables that are already there.

## Day-to-day

Local iteration on a schema that is not yet shipped: `bun db:push` is still fine and still the fastest loop.

The moment a change needs to reach staging or production it needs a migration:

```bash
cd apps/server
bunx prisma migrate dev --name add_something   # writes the SQL and applies it locally
```

Review the generated SQL before committing. Prisma names things mechanically and does not know which of two similar columns you meant to keep.

## Applying elsewhere

`deploy.yml` runs two steps inside the freshly pulled server image, **before** `docker compose up -d`. Order matters: a container started against an un-migrated schema crashes on the first query touching a new column.

```bash
bun db:baseline   # marks 20260901000000_init as applied, if it is not already
bun db:deploy     # applies whatever is pending
```

The baseline step exists because production was built with `db:push` long before migrations did. `migrate deploy` refuses to run against a non-empty database with no history (`P3005`), and `migrate resolve --applied` fixes that by writing one row into `_prisma_migrations` — it executes no SQL and touches no data. Once the row is there the command reports `P3008` and the script exits 0, so it stays a no-op on every later deploy.

## Rules that avoid pain

- **A required column needs a default, or the migration fails on a non-empty table.** The `issuer` migration ships `DEFAULT 'local:credential'` for exactly this reason — every existing account came from email/password sign-up, which is what better-auth calls that provider.
- **Never edit an applied migration.** Write a new one. Prisma records a checksum and refuses to run a directory whose contents changed.
- **`--accept-data-loss` is not a way past a warning.** Prisma warns before it knows the data; check the table first (`SELECT count(*)`, look for duplicates against the new constraint) and prefer a migration that states the intent in SQL.
- **A `db push` against a database with migration history creates drift.** Once a schema is under migrations, keep it there.

## When better-auth changes its schema

better-auth owns `user`, `session`, `account` and `verification`, and a minor release can add columns to them. The tables it expects are described in `@better-auth/core/dist/db/get-tables.mjs` inside `node_modules` — comparing that against `prisma/schema/auth.prisma` after an upgrade is faster than waiting for a runtime `Unknown argument` error.
