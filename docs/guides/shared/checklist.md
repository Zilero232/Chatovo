# Checklist before a commit

```bash
bun run fix                          # ESLint --fix + Prettier + Stylelint --fix
bun run verify                       # typecheck (schemas, server, client) + ESLint + Prettier + Stylelint
bun run test                         # Vitest, every workspace — never bare `bun test`
bun --filter @chatovo/client build   # the static export; catches what typecheck can't
bun run lint:rust                    # clippy, when apps/tauri changed (needs cargo)
bun run lint:caddy                   # caddy fmt + adapt, when infra/caddy changed (fix: format:caddy)
```

The server has no build step — Bun runs its TypeScript directly, so `bun run verify` plus booting it (`bun dev:server`, env validation fires at boot) is the check.

`bun run fix` does not fix: blank lines ([blank lines](blank-lines.md)), hook order ([React](../client/react.md)), FSD import boundaries ([fsd.md](../../architecture/fsd.md)). Those are caught at review — the `style-reviewer` agent reads the guides and reports them.

## Verify before claiming anything works

`bun run verify` is the one command for the static checks; `bun run test` is separate. The release workflow's `checks` job runs the client build, `verify`, `test`, `lint:rust` and `lint:caddy` before anything is signed, so a red run there is a red run locally first.

The client build is the only check that catches a static-export breakage: `output: 'export'` has no server, so a route that needs one (a dynamic segment without `generateStaticParams`, a route handler, a server action) fails there and nowhere else. That is also why rooms are addressed as `/room?id=…`, never `/room/<id>`.

## The toolchain

Every tool version comes from [mise.toml](../../../mise.toml): `mise install` in the repo root gives the same bun, node and Rust that CI uses. Android additionally needs the SDK, the NDK and a JDK, configured in `apps/tauri/.env`.

## Docs move with the code

A change that alters a rule updates the guide in `docs/guides/` **and** its digest in `.claude/rules/` in the same commit. A new design decision goes into `docs/architecture/`, and a new doc gets a line in [docs/README.md](../../README.md).
