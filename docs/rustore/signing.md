# Android signing

An unsigned release APK will not install on a device — Android reports it as
invalid. The AAB uploaded to RuStore is signed with the upload key, and the store
re-signs the APKs it generates from it with the app signing key.

## 1. Create the upload key (once)

```bash
keytool -J-Dkeystore.pkcs12.legacy -genkeypair -v \
  -keystore chatovo-release.keystore -alias chatovo \
  -keyalg RSA -keysize 2048 -validity 10000
```

`-J-Dkeystore.pkcs12.legacy` is not optional. A modern JDK encrypts PKCS12 with
algorithms the PEPK tool of step 3 cannot read, and it reports that as
`keystore password was incorrect` — with the correct password. Keep both
passwords identical: `android-signing.kts` feeds one property into `keyPassword`
and `storePassword` alike.

Keep the keystore and the passwords safe. **Losing them means the app can never
be updated.**

The keystore is regenerable only until the first version is published. After
that the upload key changes only through RuStore support, and the app signing
key not at all — so this command is effectively one-shot.

Run it on its own line. In fish, pasting it together with the next command
leaves the password prompt reading from the wrong buffer, and keytool fails with
a password error that has nothing to do with the password.

## 2. GitHub Actions secrets

**Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `ANDROID_KEY_ALIAS` | key alias, e.g. `chatovo` |
| `ANDROID_KEY_PASSWORD` | keystore + key password |
| `ANDROID_KEY_BASE64` | the `.keystore` / `.jks` file itself, base64 |

Encode the keystore:

```bash
# macOS (BSD base64 has no -w; strip the wrapping by hand)
base64 -i chatovo-release.keystore | tr -d '\n' > keystore.base64

# Linux / Git Bash
base64 -w0 chatovo-release.keystore

# PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("chatovo-release.keystore"))
```

`keystore.base64` is not a second artefact — it is the same private key written
as text, because a GitHub secret takes text and not a file. Treat it like the
keystore, delete the local copy once the secret is set, and regenerate it from
the keystore whenever it is needed again.

Verify the round-trip before pasting it (`base64 -D` on macOS, `-d` elsewhere):

```bash
base64 -D -i keystore.base64 -o roundtrip.bin && cmp chatovo-release.keystore roundtrip.bin && echo ok
```

`android-signing.mjs` decodes the secret back with `Buffer.from(…, 'base64')`,
so a stray newline in it breaks the build rather than the paste.

Job `android` in `release.yml` wires signing up after `tauri android init` and
verifies the APK with `apksigner` before uploading.

## 3. RuStore app signing

RuStore accepts an AAB only with store-side signing enabled: the store builds an
APK per architecture from the bundle and signs each with the app signing key. The
developer signs the uploaded bundle with the upload key.

**App Signing Key → Upload Signing Key** opens a four-step modal. Step 2 shows a
`pepk.jar` command with an `--encryptionkey` value **unique to this app** — copy
it from the console rather than from here, and download `pepk.jar` from step 1.

Produce the two files it asks for:

```bash
# step 3 — the private key, encrypted so that only RuStore can read it
java -jar pepk.jar --keystore=chatovo-release.keystore --alias=chatovo \
  --output=pepk_out.zip --encryptionkey=<from the console> --include-cert

# step 4 — the upload certificate, PEM (-rfc; without it keytool writes DER)
keytool -exportcert -alias chatovo -keystore chatovo-release.keystore \
  -rfc -file uploadcert.pem
```

Both files have to stay under 100 KB. `pepk_out.zip` is safe to hand over — the
private key inside it is encrypted with RuStore's public key. The keystore itself
never leaves the machine.

PEPK needs a JDK (`brew install --cask temurin`) and reads the password only from
an interactive terminal — `System.console()` is null anywhere else, including a
pipeline or a CI step. Pass `--keystore-pass=` / `--key-pass=` when scripting.
Run the pepk command alone rather than pasted together with the keytool one,
for the same reason as in step 1.

Check the two files agree before uploading — the certificate inside the ZIP has
to be the one in `uploadcert.pem`:

```bash
unzip -o -q pepk_out.zip -d zipcheck
openssl x509 -in uploadcert.pem          -noout -fingerprint -sha256
openssl x509 -in zipcheck/certificate.pem -noout -fingerprint -sha256
rm -rf zipcheck
```

`pepk_out.zip` and `uploadcert.pem` are consumed by the upload and can be
deleted afterwards; both are reproducible from the keystore. What must survive
is the keystore and its password.

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

**The very first version has to be published by hand**, through `App page →
Upload` in the console: a draft inherits its unset fields from the active
version, so until one exists `createDraftVersion` answers `403 This user does not
have rights to perform this action` — which reads like a permissions problem and
is not one. Fill in the listing, publish, and every later tag flows through CI.

The APK on the GitHub Release stays a sideload channel and is never uploaded to
RuStore.
