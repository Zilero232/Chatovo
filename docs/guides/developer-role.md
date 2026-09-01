# The developer role

Some parts of the UI single out the people who build Chatovo: a contributors strip in the lobby, a "Developers" tab in the friends dialog, and a badge next to their name in chat and participant lists.

All of it is driven by one column — `user.role` — and there is no UI to grant it.

## How someone becomes a developer

`role` lives on the `user` table and defaults to `'user'`. The only value that changes anything is `'admin'`:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@example.com';
```

There is deliberately no endpoint for this. Promoting a user is a database operation, done by hand, on purpose — an API that hands out elevated roles is a liability nobody asked for.

## What reads it

| Surface | Where | What it shows |
| --- | --- | --- |
| Lobby contributors | `views/lobby/.../LobbyContributors` | Avatar + name of every admin |
| Friends → Developers | `widgets/social/friends-dialog/.../DevelopersTab` | The same list, with an "add friend" action |
| Name badge | `entities/auth/user/ui/UserName` | A marker beside the name wherever it renders |

The data comes from `GET /users/developers`, which returns every user with `role = 'admin'` mapped through `toUserProfile`. On the client it is `useDevelopers()` — a TanStack query cached for an hour, since the list changes about never.

## An empty list is not a bug

`LobbyContributors` returns `null` when the list is empty, so the section simply does not render. A fresh database has no admins, so **nothing shows until someone is promoted** — that is the expected state, not a failure.

If the strip is missing and you expect it to be there, check the data first:

```sql
SELECT role, count(*) FROM "user" GROUP BY role;
```

## Note on `verified`

`Profile.verified` is a separate flag with its own badge and no relation to `role`. A user can be verified without being a developer, and the other way round. Don't conflate them when reading `toUserProfile`.
