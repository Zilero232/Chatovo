# RuStore — Chatovo

Checklist and copy-paste material for publishing the Android app `chatovo.app`
to RuStore.

RuStore is the only store the app ships to. The APK on GitHub Releases stays as
a sideload channel.

## Status in the repo

| Item | Status |
|------|--------|
| Privacy policy `/privacy` | Done (client) |
| Terms `/terms` | Done (client) |
| Android Tauri config | Done (`tauri.android.conf.json`) |
| Mobile capability | Done (`capabilities/mobile.json`) |
| Android mic/camera manifest | Done (`build.rs` → `tauri_utils::build::update_android_manifest`) |
| Desktop-only UI gated | Done (`isTauriDesktop()`) |
| CORS for the Android WebView | Done (`http(s)://localhost`) |
| `gen/android/` project | `bun android:init` locally / in CI (gitignored) |
| Upload key | Required — see [signing.md](signing.md) |
| RuStore in-app update SDK | Done (`scripts/setup-rustore-update.mjs`) |
| Automated RuStore upload | Done (`scripts/rustore-publish.mjs`, job `rustore` in `release.yml`) |
| Community rules in `/terms` | Done (client, both locales) |
| Report a user / a message | Done (`features/social/report-abuse`) |
| Blocking offenders | Done (`modules/moderation` on the server) |
| Consent checkbox on signup | Done (sign-up form) |
| Admin panel | Done (`/admin`, four tabs — see [moderation.md](moderation.md)) |
| Store listing | See [listing.md](listing.md) |
| Personal data | See [data-safety.md](data-safety.md) |
| Moderation and UGC | See [moderation.md](moderation.md) |
| Review account | See [review-account.md](review-account.md) |

## Commands

```bash
# One-time: Android Studio + SDK/NDK, rust android targets
bun android:init

# Dev on a device/emulator
bun android:dev

# Release build (APK + AAB)
bun android:build
# Output: apps/tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab
```

## CI (GitHub Actions)

| Workflow | Trigger | Contents |
|----------|---------|----------|
| `release.yml` | push a `v*` tag | `vX.Y.Z` — desktop installers (Windows, macOS arm64 + x64, Linux), signed Android APK + AAB, and the RuStore upload |
| `deploy.yml` | manual run | Web client + API images to GHCR, then the VPS stack (no GitHub Release) |

Job `android` builds and signs the artifacts; job `rustore` uploads the AAB as a
draft version and submits it for moderation. Publication is set to `MANUAL` —
once moderation passes, the version has to be published by hand from the RuStore
console, so a release never reaches users earlier than intended.

## Environment

`apps/tauri/.env` (copy of `.env.example`) — read by every `android:*` script:

```env
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
ANDROID_HOME=C:\Users\<you>\AppData\Local\Android\Sdk
NDK_HOME=C:\Users\<you>\AppData\Local\Android\Sdk\ndk\<version>
```

Install the NDK from Android Studio → SDK Manager, then point `NDK_HOME` at the
folder under `ndk\`.

Required SDK Tools (SDK Manager → SDK Tools tab):

- **Android SDK Command-line Tools (latest)** — without it `tauri android init` fails
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

## In-app updates

RuStore does not allow updating an app around the store, so the Tauri updater
stays off on Android (it is already gated behind `isTauriDesktop()`) and updates
go through the **RuStore in-app update SDK**.

The `ru.rustore.sdk:appupdate` dependency is declared in
`[package.metadata.cargo-android]` in `apps/tauri/Cargo.toml`, which the Tauri
CLI applies while generating `gen/android`. What has no hook there —
the RuStore maven repositories, the proguard keep rules (release builds run R8)
and a Kotlin hook in `MainActivity` — is patched by
`scripts/setup-rustore-update.mjs`, which runs from every `android:*` script
next to `setup-android-fcm.mjs`.

The update type is `IMMEDIATE`: the user gets a blocking RuStore screen and
cannot continue on an outdated build. For a realtime app that is the right
choice over `FLEXIBLE` — the protocol between the client and the server changes
between releases.

The SDK needs the RuStore app installed and up to date, a signed-in user, and
the install permission granted to RuStore. When any of that is missing it throws
`RuStoreNotInstalledException`; the hook swallows every failure so the app still
opens.

## Push notifications

Push stays on Firebase Cloud Messaging: it works on any device that has Google
services, including ones where the app was installed from RuStore.

FCM is the only push transport. Devices with no Google mobile services (Huawei
and a few Russian ROMs) therefore get no push — everything else in the app still
works for them.

Covering those devices needs the RuStore Push SDK, and no Tauri plugin for it
exists: it would mean writing one (Rust wrapper, Kotlin service, JS bridge) and
publishing it. That was weighed and deliberately left out — the store an app
ships from and the service that delivers its notifications are unrelated, and
most Android phones in Russia ship with Google services regardless of where the
app was installed from.

### Firebase Console

1. Create a Firebase project (or reuse an existing one).
2. Add an Android app with the package `chatovo.app`.
3. Download `google-services.json`.
4. Project settings → Service accounts → Generate new private key → keep the JSON for the server.

### Android app

`gen/android/` is gitignored and regenerated by `tauri android init`. Do **not**
edit it by hand.

1. Download `google-services.json` from the Firebase Console (Android app `chatovo.app`).
2. Save it to **`apps/tauri/android/google-services.json`** (committed — not a secret).
3. Run any android script — `setup-android-fcm.mjs` copies the file into `gen/android/app/` (the Gradle plugin comes from `Cargo.toml`).

`POST_NOTIFICATIONS` is injected through `build.rs` on every build. Plugin
permission: `fcm:default` in `capabilities/mobile.json`.

### Server

Set `FIREBASE_SERVICE_ACCOUNT` in the root `.env` to the service account JSON on
a single line. Push is skipped when the user holds an open realtime WebSocket.

## Before the first submission

1. RuStore developer account verified (a company, or an individual through VK ID + passport and a video check)
2. **Personal data operator** status filed — RuStore requires it when personal data is collected
3. App `Chatovo` created with the package `chatovo.app`
4. Upload key certificate uploaded and RuStore app signing enabled — see [signing.md](signing.md)
5. Privacy policy in Russian: `https://chatovo.ru/privacy`
6. Support mailbox `zilero@chatovo.ru` reachable
7. Review account created: [review-account.md](review-account.md)
8. At least one account holding the `admin` role — promote the first one in the database, the rest from the Users tab: [moderation.md](moderation.md)
9. API key created and the secrets added to GitHub Actions
10. Database migrated: `bun db:deploy` from `apps/server/` applies `20260903000000_add_moderation` — the `abuse_reports` table, the block columns on `user` and `push_device.provider`. The migration is additive; nothing is dropped.

## Package identifiers

| Platform | Identifier |
|----------|------------|
| Desktop | `chatovo.desktop` |
| Android | `chatovo.app` |

## Version code

Version `1.3.6` from `tauri.android.conf.json` → `versionCode = 1003006`.

RuStore rejects an upload whose `versionCode` is not higher than the active one.

Override it in the config:

```json
"bundle": { "android": { "versionCode": 1003006 } }
```
