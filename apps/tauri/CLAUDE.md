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
- **Desktop-only features** (system tray, global shortcuts, deep links, updater) are implemented on the JS side in [apps/client/features/app/](../client/features/app/) using `@tauri-apps/api` + plugin packages. The exception is the **system tray**: a JS-created tray loses its click handler when React remounts, so the icon and its native menu are built in [src/tray_menu.rs](src/tray_menu.rs) at startup and the frontend only pushes labels and state — see [docs/architecture/tray-menu.md](../../docs/architecture/tray-menu.md).
- Every Tauri call on the client **must** be gated with `isTauri()` so the web build keeps working (`isTauri()` is false in the browser).
- Native plugins enabled here (see [src/lib.rs](src/lib.rs)): global-shortcut, updater, os, single-instance, opener, process, deep-link. The `chatovo://` deep-link scheme is registered at runtime in dev (installers handle it in prod).

## Commands (from repo root)

```bash
bun tauri:dev          # run the desktop dev shell
bun tauri:build        # produce a native binary
bun android:init # init Android project (requires SDK + NDK)
bun android:dev  # run on Android device/emulator
bun android:build # build the APK + the RuStore AAB
```

Releases are built by `.github/workflows/release.yml` on a `v*` tag — desktop
via `tauri-action` (Windows, macOS arm64 + x64, Linux), Android signed by
`scripts/android-signing.mjs` from the `ANDROID_KEY_*` secrets. The local
commands above are for development.

Android setup: install Android Studio (SDK + NDK), copy `apps/tauri/.env.example` → `.env`, set `NDK_HOME` to your installed NDK folder, then `bun android:init`. See [docs/rustore/README.md](../../docs/rustore/README.md).

**WebRTC (mic/camera):** `build.rs` calls `tauri_utils::build::update_android_manifest` (same API Tauri plugins use) to inject `RECORD_AUDIO`, `CAMERA`, and `MODIFY_AUDIO_SETTINGS` into `gen/android/.../AndroidManifest.xml` on Android builds. Without these, `getUserMedia` fails on Android — `RustWebChromeClient` can only show the OS prompt when permissions are declared in the manifest.

**Gradle wiring:** everything Android needs on top of the Tauri template is patched into the regenerated `gen/android/` by the two scripts below. `[package.metadata.cargo-android]` looks like the declarative way to do it, but it reaches the template only on the very first `android init` — `tauri android build` re-renders the build files without it, and the build then fails on `Unresolved reference` for anything declared that way. The patches anchor on block structure (`buildscript { … dependencies {`, `id("rust")`) rather than on a version string, so a Tauri bump does not silently skip them.

**FCM (push):** `google-services.json` lives in `android/` (committed). `scripts/setup-android-fcm.mjs` runs before every `android:*` build, copies it into `gen/android/app/` and applies the Google Services Gradle plugin — `gen/` is gitignored and must not be edited by hand. FCM is the only push transport; devices with no Google mobile services get no push. Covering them would need a RuStore Push Tauri plugin, which does not exist and was deliberately not written.

**RuStore in-app updates:** `scripts/setup-rustore-update.mjs` runs alongside the FCM overlay and patches the regenerated `gen/android/` — RuStore maven repos, the `ru.rustore.sdk:appupdate` dependency, proguard keep rules (release builds run R8), and an `IMMEDIATE` update check in `MainActivity.onCreate`. Android never uses the Tauri updater; it is gated behind `isTauriDesktop()`.

**Android dev:** `bun dev:server` + `bun android:dev`. HMR shim in client `layout.tsx` (`getTauriMobileHmrShim`).
