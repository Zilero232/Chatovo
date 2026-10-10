---
paths:
  - 'apps/client/**/*.scss'
---

<!-- Compressed editing rules, loaded automatically when an SCSS module is edited. -->
<!-- The full reasoning is docs/guides/client/styles.md; keep them in sync. -->

# Client — styles

SCSS modules only (`*.module.scss`, imported as `s`); CSS-in-JS is banned. Tokens are CSS variables (`ui-kit/styles/_tokens.scss` through `app/globals.scss`): `--space-*`, `--icon-*`, `--control-*`, colours, radii — no raw values where a token exists. Shared mixins: `@use '@/ui-kit/styles/mixins' as *`, never `../../../`.

The theme is dark, hard-coded on `<html className="dark">`. Property order is Stylelint's job — `bun lint:css:fix`.

No `@keyframes` for enter/exit — that is `motion`'s job. CSS keeps hover/focus transitions, infinite loops and decorative backgrounds.
