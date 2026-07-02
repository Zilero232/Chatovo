# Android release signing

## 1. Create keystore (once)

```bash
keytool -genkey -v -keystore chatovo-release.keystore -alias chatovo -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore and passwords securely. **Loss = cannot update the app.**

## 2. Configure signing in Tauri Android project

After `bun tauri:android:init`, configure signing in the generated Gradle project under `apps/tauri/gen/android/`.

Typical approach — create `keystore.properties` (git-ignored):

```properties
storeFile=../../chatovo-release.keystore
storePassword=...
keyAlias=chatovo
keyPassword=...
```

Wire into `app/build.gradle.kts` per [Tauri Android signing docs](https://v2.tauri.app/distribute/sign/android).

## 3. Play App Signing

In Play Console, enable **Google Play App Signing** on first upload. Google manages the app signing key; you upload with an upload key.

## 4. Build AAB

```bash
bun tauri:android:build
```

Upload `app-universal-release.aab` to Internal testing first.
