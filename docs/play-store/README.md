# Google Play — Chatovo

Checklist and copy-paste materials for publishing `chatovo.app`.

## Status in repo

| Item | Status |
|------|--------|
| Privacy Policy `/privacy` | Done (client) |
| Terms `/terms` | Done (client) |
| Android Tauri config | Done (`tauri.android.conf.json`) |
| Mobile capability | Done (`capabilities/mobile.json`) |
| Desktop-only UI gated | Done (`isTauriDesktop()`) |
| CORS for Android WebView | Done (`http(s)://localhost`) |
| `gen/android/` project | Run `bun tauri:android:init` locally / in CI (gitignored) |
| Release keystore | Required for CI APK sideload — see `signing.md` |
| GitHub Actions | `deploy-web.yml`, `release-app.yml` |
| Play Console listing | See `listing.md` |
| Data safety answers | See `data-safety.md` |
| Review demo account | See `review-account.md` |

## Commands

```bash
# One-time: Android Studio + SDK/NDK, rust android targets
bun tauri:android:init

# Dev on device/emulator
bun tauri:android:dev

# Release bundle for Play Store
bun tauri:android:build
# Output: apps/tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab
```

## CI (GitHub Actions)

| Workflow | Trigger | Contents |
|----------|---------|----------|
| `deploy-web.yml` | push to `master` | Web client + API deploy to VPS (no GitHub Release) |
| `release-app.yml` | `package.json` bump | Unified `vX.Y.Z` — desktop installers + Android APK |

Play Store signed AAB is separate — see `signing.md`.

## Environment

`apps/tauri/.env` (copy from `.env.example`) — loaded by all `android:*` scripts:

```env
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
ANDROID_HOME=C:\Users\<you>\AppData\Local\Android\Sdk
NDK_HOME=C:\Users\<you>\AppData\Local\Android\Sdk\ndk\<version>
```

Install NDK in Android Studio → SDK Manager, then set `NDK_HOME` to the folder under `ndk\`.

Required SDK Tools (SDK Manager → SDK Tools tab):

- **Android SDK Command-line Tools (latest)** — without this `tauri android init` fails
- NDK (Side by side)
- Android SDK Build-Tools
- Android SDK Platform-Tools
- At least one Android SDK Platform (API 34+)

Verify after install:

```bat
dir "%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"
dir "%LOCALAPPDATA%\Android\Sdk\ndk"
```

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

## Before first upload

1. Play Console account verified + $25 paid
2. Create app `Chatovo`, package `chatovo.app`
3. Privacy policy URL: `https://chatovo.ru/privacy`
4. Support email: `zilero@chatovo.ru` (must work)
5. Internal testing track → real device smoke test
6. Production release

## Package IDs

| Platform | Identifier |
|----------|------------|
| Desktop | `ru.chatovo.desktop` |
| Android | `chatovo.app` |

## Version codes

From `tauri.android.conf.json` version `1.1.1` → `versionCode = 1001001`.

Override in config if needed:

```json
"bundle": { "android": { "versionCode": 1001001 } }
```
