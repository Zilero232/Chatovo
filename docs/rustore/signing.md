# Android signing

An unsigned release APK will not install on a device — Android reports it as
invalid. The AAB uploaded to RuStore is signed with the upload key, and the store
re-signs the APKs it generates from it with the app signing key.

## 1. Create the upload key (once)

```bash
keytool -genkey -v -keystore chatovo-release.keystore -alias chatovo -keyalg RSA -keysize 2048 -validity 10000
```

Keep the keystore and the passwords safe. **Losing them means the app can never
be updated.**

## 2. GitHub Actions secrets

**Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `ANDROID_KEY_ALIAS` | key alias, e.g. `chatovo` |
| `ANDROID_KEY_PASSWORD` | keystore + key password |
| `ANDROID_KEY_BASE64` | the `.keystore` / `.jks` file itself, base64 |

Encode the keystore:

```bash
# Linux / macOS / Git Bash
base64 -w0 chatovo-release.keystore

# PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("chatovo-release.keystore"))
```

Job `android` in `release.yml` wires signing up after `tauri android init` and
verifies the APK with `apksigner` before uploading.

## 3. RuStore app signing

RuStore accepts an AAB only with store-side signing enabled: the store builds an
APK per architecture from the bundle and signs each with the app signing key. The
developer signs the uploaded bundle with the upload key.

On the app page in the RuStore console, upload:

1. **The upload key certificate** — the public half in PEM:

   ```bash
   keytool -export -rfc -alias chatovo -keystore chatovo-release.keystore -file upload-certificate.pem
   ```

2. **The app signing key** — a ZIP that RuStore uses to re-sign. If the app has
   never been published anywhere, the same keystore can serve as the signing key.

Once signing is enabled, the upload key cannot be changed without contacting
RuStore support.

## 4. The Public API key for automated uploads

RuStore console → the **Company** tab (for legal entities) or **Developer** (for
individuals) → **API RuStore** → **Create key**. Requires the owner or
administrator role. The key belongs to the company rather than to a person, so it
survives staff changes.

When creating it, pick the applications and the allowed API methods — uploading a
version and submitting it for moderation is enough for CI.

The private key is shown once, in a popup. CI secrets:

| Secret | Value |
|--------|-------|
| `RUSTORE_KEY_ID` | the numeric key id from the key table |
| `RUSTORE_PRIVATE_KEY` | the private key, base64 on a single line |
| `RUSTORE_PACKAGE_NAME` | `chatovo.app` |

Paste `RUSTORE_PRIVATE_KEY` exactly as the console shows it.

The upload itself runs through the [`rustore`](https://github.com/romankurnovskii/rustore)
npm package (MIT, a typed Public API client) wrapped by
`apps/tauri/scripts/rustore-publish.mjs`. The package signs the request with
RSA-SHA512, refreshes the token and knows the field limits, so there is no
hand-rolled HTTP client here.

## 5. Local builds

```bash
cp .env.example .env
```

Production URLs for a device build:

```env
NEXT_PUBLIC_API_URL=https://api.chatovo.ru
NEXT_PUBLIC_LIVEKIT_URL=wss://livekit.chatovo.ru
```

After `bun android:init`, configure signing in `apps/tauri/gen/android/` per the
[Tauri docs](https://v2.tauri.app/distribute/sign/android):

1. `gen/android/keystore.properties` — path to the `.keystore`, alias, passwords
2. `gen/android/app/build.gradle.kts` — `signingConfigs` and `signingConfig` on `release`

Then:

```bash
bun android:build
```

The Gradle edits have to be repeated after every `tauri android init` — `gen/` is
regenerated. Locally that is the same script CI runs:

```bash
ANDROID_KEY_ALIAS=chatovo ANDROID_KEY_PASSWORD=... ANDROID_KEY_BASE64=$(base64 -w0 chatovo-release.keystore) \
  node apps/tauri/scripts/android-signing.mjs
```

## 6. What to upload to RuStore

`bun android:build` produces the APK and the AAB in one run. RuStore takes the
**AAB** — `app-universal-release.aab`.

The `release` workflow builds and signs both on CI whenever a `v*` tag is pushed,
and job `rustore` uploads the AAB as a draft version and submits it for
moderation. A local build is only needed to test the signing setup itself.

The APK on the GitHub Release stays a sideload channel and is never uploaded to
RuStore.
