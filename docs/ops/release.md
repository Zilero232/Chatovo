# Releasing the apps

Desktop installers and the Android bundle ship together from [.github/workflows/release.yml](../../.github/workflows/release.yml). There are no local release scripts.

```text
checks ─ draft ─┬─ desktop (windows, macos-aarch64, macos-x86_64, linux) ─┬─ publish
                └─ android (signed aab) ──────────────────────────────────┘
```

## Cutting a release

The version lives in the root `package.json` only; the per-app manifests stay at `0.0.0`. Bump it, then:

```bash
git tag v1.2.8 && git push --tags
```

The `checks` job refuses a tag that doesn't match the root version, then runs the client build, `bun run verify`, `bun run test` and `bun run lint:rust`. Nothing is signed for a commit that doesn't pass.

A manual run (Actions → release → Run workflow) takes `targets` — `all`, `desktop` or `android` — to rebuild one platform without paying for the other. Either way the release is appended to, never replaced, and stays a draft until `publish` flips it.

## What each job does

- **desktop** — `tauri-action` on a runner per platform (Tauri can't cross-compile). It builds the client itself and merges every platform into one `latest.json` for the updater. macOS ships separate bundles per architecture because the updater keys its platforms on it.
- **android** — `tauri android init` regenerates `gen/android`, then the FCM and signing overlays are applied, then the aab is built for `aarch64` and `x86_64` and attached to the draft. The Google Play upload stays manual — [google-play/](google-play/README.md).

## The toolchain

Bun, Node and Rust come from [mise.toml](../../mise.toml) through `.github/actions/setup` (`jdx/mise-action`); a job asks for Rust with `tools: rust`, and the extra Rust targets (macOS arches, Android) through `rust-targets`. The JDK, the Android SDK and the NDK stay with their own actions (`setup-java`, `setup-android`, `setup-ndk`). Bumping bun means `mise.toml` and the `oven/bun` tag in both Dockerfiles.

## Secrets

Listed in the header of `release.yml`: the `NEXT_PUBLIC_*` URLs baked into every bundle, `TAURI_SIGNING_PRIVATE_KEY` for the updater, and `ANDROID_KEY_*` for the Play upload key. The Android keystore is the *upload* key — Play App Signing holds the app key, so the upload key can be rotated from the Console if it leaks ([google-play/signing.md](google-play/signing.md)).
