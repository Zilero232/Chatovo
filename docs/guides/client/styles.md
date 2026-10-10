# Styles and SCSS

| Layer | Format |
|---|---|
| `ui-kit/**` | `*.module.scss` + CSS variables from `globals.scss` |
| widgets / features / views | `*.module.scss` |

| Case | Where |
|---|---|
| Component styles in `ui-kit` | `<Name>.module.scss` |
| Slice subcomponent styles | `<Name>.module.scss` |
| Joining module classes with an optional `className` prop | `clsx(...)` |
| Conditional classes | maps in TSX (`variantClass[variant]`) or SCSS modifiers |

The principle: JSX stays readable, and `s.root` / `s.header` tell you the structure.

## 12. Global styles and tokens

- Theme tokens are CSS variables in `app/globals.scss` (`:root` + `.dark`).
- Dark theme is hardcoded as `<html className="dark">` (incompatible with `next-themes` + Tauri).
- Theme tokens, spacing and sizes live in `ui-kit/styles/_tokens.scss` (`--space-*`, `--icon-*`, `--control-*`, colours, radii). Wired in through `app/globals.scss`.
- Component styles are `*.module.scss`; shared mixins come from `@use '@/ui-kit/styles/mixins' as *` (`loadPaths` + `turbopack.resolveAlias` in `next.config.ts`).
- `clsx` joins module classes with the `className` prop.

## Animation

Enter/exit animations, layout transitions and stagger go through **`motion`** (`motion.div`, `AnimatePresence`, `useReducedMotion`). CSS keeps only hover/focus transitions, infinite loops (spinner, pulse) and decorative backgrounds. Don't write `@keyframes` for enter/exit: they don't react to state and they fight with motion. Overlays built on Base UI have their own two working approaches — see [Base UI](base-ui.md) ("Animating overlays").

## Stylelint

`bun lint:css:fix` sorts properties (`stylelint-config-idiomatic-order` on top of `@siberiacancode/stylelint`). Don't order properties by hand and don't argue with the output.
