---
paths:
  - 'apps/client/**/*.{ts,tsx}'
  - 'apps/client/shared/i18n/locales/**'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/guides/client/i18n.md; keep them in sync. -->

# Client — i18n

Every user-visible string goes through `next-intl`: `useTranslations` in client components, `getTranslations` from `next-intl/server` in server ones. Keys live in `shared/i18n/locales/{en,ru}/<namespace>.json` — the same files and keys in both; the tests in `shared/i18n/_tests/` fail on a missing key, an untranslated error code or an unused key. Don't edit the generated `messages.d.ts`.
