# Forbidden

- `console.log` in a commit. Rule `no-console` (`**/scripts/**` — off).
- `any` — rule `ts/no-explicit-any`. Use `unknown`.
- A non-null assertion `!` without justification — rule `ts/no-non-null-assertion`.
- Deep imports past a barrel.
- Cross-imports between slices of the same layer.
- CSS-in-JS. SCSS modules only.
- A manual `fetch` / your own `axios.create` for business calls. Only the shared instance from `shared/api/http`.
- Duplicating schemas between client and server. Only `@chatovo/schemas`.
- `useState` for form fields. Only `react-hook-form`.
- Nested `if (...) return <X />` across 3+ branches. Use `ts-pattern match`.
- Prop drilling when the leaf can call the hook itself.
- `useEffect` + `fetch` / `mutate` to load data. Only `useQuery` with a key.
- Hand-rolling what an installed library already provides — [dependencies](dependencies.md).
- `interface` — rule `ts/consistent-type-definitions` (`type` only).
- An unguarded Tauri call — every one sits behind `isTauri()` ([Tauri on the client](../client/tauri.md)).
