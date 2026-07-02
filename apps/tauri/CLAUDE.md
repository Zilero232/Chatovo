# CLAUDE.md — apps/tauri

Guidance for Claude Code when working in the desktop shell. Extends the root [../../CLAUDE.md](../../CLAUDE.md) → "Tauri specifics"; root rules still apply.

Desktop shell — **Tauri 2 (Rust)**. Wraps the same Next.js client ([apps/client](../client/)) in a native window; no separate UI lives here.

## Layout

```
src/
├── main.rs           # binary entry — calls lib::run()
└── lib.rs            # Tauri builder: registers plugins, deep-link scheme, single-instance
capabilities/         # permission sets granted to the webview
icons/                # generated — source: icon.manifest.json + apps/client/app/app-icon*.svg
tauri.conf.json       # config — frontendDist points at the built client, bundle/updater settings
Cargo.toml            # Rust deps (tauri + plugins)
```

## How it relates to the client

- The window loads the client build via `tauri.conf.json` → `frontendDist`.
- **Desktop-only features** (system tray, global shortcuts, deep links, updater) are implemented on the JS side in [apps/client/features/app/](../client/features/app/) using `@tauri-apps/api` + plugin packages.
- Every Tauri call on the client **must** be gated with `isTauri()` so the web build keeps working (`isTauri()` is false in the browser).
- Native plugins enabled here (see [src/lib.rs](src/lib.rs)): global-shortcut, updater, os, single-instance, opener, process, deep-link. The `chatovo://` deep-link scheme is registered at runtime in dev (installers handle it in prod).

## Commands (from repo root)

```bash
bun tauri:dev          # run the desktop dev shell
bun tauri:build        # produce a native binary
bun tauri:android:init # init Android project (requires SDK + NDK)
bun tauri:android:dev  # run on Android device/emulator
bun tauri:android:build # build Play Store AAB
```

Android setup: install Android Studio (SDK + NDK), copy `apps/tauri/.env.example` → `.env`, set `NDK_HOME` to your installed NDK folder, then `bun tauri:android:init`. See [docs/play-store/README.md](../../docs/play-store/README.md).

**Android dev:** `bun dev:server` + `bun tauri:android:dev`. HMR shim in client `layout.tsx` (`getTauriMobileHmrShim`).
