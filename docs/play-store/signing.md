# Android release signing

Unsigned release APKs cannot be installed on a real device — Android reports them as invalid or corrupted.

## 1. Create keystore (once)

```bash
keytool -genkey -v -keystore chatovo-release.keystore -alias chatovo -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore and passwords securely. **Loss = cannot update the app.**

## 2. GitHub Actions secrets (CI)

Add in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|--------|
| `ANDROID_KEY_ALIAS` | keystore alias, e.g. `chatovo` |
| `ANDROID_KEY_PASSWORD` | keystore + key password |
| `ANDROID_KEY_BASE64` | base64 of the `.keystore` / `.jks` file |

Encode keystore:

```bash
# Linux / macOS / Git Bash
base64 -w0 chatovo-release.keystore

# PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("chatovo-release.keystore"))
```

`release-app.yml` configures signing inline after `tauri android init` and verifies the APK with `apksigner` before upload.

## 3. Local builds

```bash
cp apps/client/.env.example apps/client/.env
```

Production URLs for a device build:

```env
NEXT_PUBLIC_API_URL=https://api.chatovo.ru
NEXT_PUBLIC_LIVEKIT_URL=wss://livekit.chatovo.ru
```

After `bun tauri:android:init`, configure signing in `apps/tauri/gen/android/` per [Tauri Android signing](https://v2.tauri.app/distribute/sign/android):

1. `gen/android/keystore.properties` — path to your `.keystore`, alias, passwords
2. `gen/android/app/build.gradle.kts` — `signingConfigs` + `signingConfig` on `release`

Then:

```bash
bun tauri:android:build
```

Re-run the Gradle edits if you run `tauri android init` again (`gen/` is regenerated).

## 4. Play App Signing

In Play Console, enable **Google Play App Signing** on first upload. Google manages the app signing key; you upload with an upload key.

## 5. Build AAB for Play Store

```bash
bun tauri:android:build:aab
```

Upload `app-universal-release.aab` to Internal testing first.
