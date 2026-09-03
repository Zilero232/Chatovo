import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SDK_VERSION = '10.5.1';
const MAVEN_URLS = [
  'https://nexus-external.vkteam.ru/repository/maven/',
  'https://artifactory-external.vkpartner.ru/artifactory/maven'
];

const tauriRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const genRoot = join(tauriRoot, 'gen/android');
const genApp = join(genRoot, 'app');
const appGradlePath = join(genApp, 'build.gradle.kts');
const rootGradlePath = join(genRoot, 'build.gradle.kts');

if (!existsSync(appGradlePath)) {
  console.warn('[rustore] gen/android not found — run `bun android:init` first');
  process.exit(0);
}

// A silent no-op is the dangerous failure here: the build would succeed with no
// update check in it. Every patch asserts it actually changed the file.
const replaceOrFail = (source, pattern, replacement, what) => {
  const patched = source.replace(pattern, replacement);

  if (patched === source) {
    throw new Error(
      `[rustore] could not patch ${what} — the Tauri template changed, update setup-rustore-update.mjs`
    );
  }

  return patched;
};

const findMainActivity = (root) => {
  if (!existsSync(root)) {
    return null;
  }

  for (const entry of readdirSync(root)) {
    const path = join(root, entry);

    if (statSync(path).isDirectory()) {
      const found = findMainActivity(path);

      if (found) {
        return found;
      }
    } else if (entry === 'MainActivity.kt') {
      return path;
    }
  }

  return null;
};

const addMavenRepositories = () => {
  let gradle = readFileSync(rootGradlePath, 'utf8');
  const missing = MAVEN_URLS.filter((url) => !gradle.includes(url));

  if (missing.length === 0) {
    return;
  }

  const block = missing.map((url) => `        maven { setUrl("${url}") }`).join('\n');

  gradle = replaceOrFail(
    gradle,
    /(allprojects\s*\{[\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n\s*repositories\s*\{)/,
    `$1\n${block}`,
    'the maven repositories in build.gradle.kts'
  );

  writeFileSync(rootGradlePath, gradle);
};

const addDependency = () => {
  let gradle = readFileSync(appGradlePath, 'utf8');

  if (gradle.includes('ru.rustore.sdk:appupdate')) {
    return;
  }

  gradle = replaceOrFail(
    gradle,
    /dependencies\s*\{/,
    `dependencies {\n    implementation("ru.rustore.sdk:appupdate:${SDK_VERSION}")`,
    'the dependencies block in app/build.gradle.kts'
  );

  writeFileSync(appGradlePath, gradle);
};

// The generated release build runs R8 with `isMinifyEnabled = true`, and the
// SDK resolves parts of its API reflectively — without these the update check
// fails only in a release build.
const PROGUARD_RULES = `
# RuStore in-app update SDK
-keep class ru.rustore.sdk.** { *; }
-keep interface ru.rustore.sdk.** { *; }
-dontwarn ru.rustore.sdk.**
`;

const addProguardRules = () => {
  const proguardPath = join(genApp, 'proguard-rules.pro');

  if (!existsSync(proguardPath)) {
    return;
  }

  const rules = readFileSync(proguardPath, 'utf8');

  if (rules.includes('ru.rustore.sdk')) {
    return;
  }

  writeFileSync(proguardPath, `${rules}\n${PROGUARD_RULES}`);
};

const IMPORTS = [
  'import ru.rustore.sdk.appupdate.manager.factory.RuStoreAppUpdateManagerFactory',
  'import ru.rustore.sdk.appupdate.model.AppUpdateOptions',
  'import ru.rustore.sdk.appupdate.model.AppUpdateType',
  'import ru.rustore.sdk.appupdate.model.UpdateAvailability'
].join('\n');

// IMMEDIATE blocks the user on an outdated build: the realtime protocol between
// the client and the server changes between releases, so an old client on a new
// server is worse than a forced update. Every failure path is swallowed —
// RuStore missing, signed out, or offline must never keep the app from opening.
const UPDATE_CALL = `
  private fun checkRuStoreUpdate() {
    try {
      val updateManager = RuStoreAppUpdateManagerFactory.create(this)

      updateManager.getAppUpdateInfo()
        .addOnSuccessListener { info ->
          if (info.updateAvailability == UpdateAvailability.UPDATE_AVAILABLE) {
            updateManager.startUpdateFlow(
              info,
              AppUpdateOptions.Builder().appUpdateType(AppUpdateType.IMMEDIATE).build()
            ).addOnFailureListener { error ->
              Log.w("RuStoreUpdate", "update flow failed", error)
            }
          }
        }
        .addOnFailureListener { error ->
          Log.w("RuStoreUpdate", "update check failed", error)
        }
    } catch (error: Throwable) {
      Log.w("RuStoreUpdate", "update manager unavailable", error)
    }
  }
`;

const patchMainActivity = () => {
  const mainActivityPath = findMainActivity(join(genApp, 'src/main/java'));

  if (!mainActivityPath) {
    throw new Error('[rustore] MainActivity.kt not found — in-app updates would be missing');
  }

  let source = readFileSync(mainActivityPath, 'utf8');

  if (source.includes('checkRuStoreUpdate')) {
    return;
  }

  source = replaceOrFail(
    source,
    'import android.os.Bundle',
    `import android.os.Bundle\nimport android.util.Log\n${IMPORTS}`,
    'the imports in MainActivity.kt'
  );

  source = replaceOrFail(
    source,
    /(super\.onCreate\(savedInstanceState\)\s*\n)/,
    '$1\n    checkRuStoreUpdate()\n',
    'the onCreate body in MainActivity.kt'
  );

  source = replaceOrFail(
    source,
    /\n\}\s*$/,
    `\n${UPDATE_CALL}}\n`,
    'the class body in MainActivity.kt'
  );

  writeFileSync(mainActivityPath, source);
};

addMavenRepositories();
addDependency();
addProguardRules();
patchMainActivity();

console.info(`[rustore] in-app update SDK ${SDK_VERSION} wired into gen/android`);
