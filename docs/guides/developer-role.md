# The developer role

Two different things single out the people who build Chatovo, and they do not share a source:

- **The lobby strip** lists GitHub contributors, straight from the repository's API. Nothing about it touches the database.
- **The "Developers" tab and the name badge** are driven by `user.role` in the database, which marks Chatovo accounts.

Someone can appear in one and not the other: a contributor who never signed up has no account, and an admin who never pushed has no commits.

## How someone becomes a developer

`role` lives on the `user` table and defaults to `'user'`. The only value that changes anything is `'admin'`:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@example.com';
```

There is deliberately no endpoint for this. Promoting a user is a database operation, done by hand, on purpose — an API that hands out elevated roles is a liability nobody asked for.

## What reads it

| Surface | Where | Source |
| --- | --- | --- |
| Friends → Developers | `widgets/social/friends-dialog/.../DevelopersTab` | `GET /users/developers` — every user with `role = 'admin'` |
| Name badge | `entities/auth/user/ui/UserName` | The same role, carried on the profile |

On the client it is `useDevelopers()` — a TanStack query cached for an hour, since the list changes about never.

## The lobby strip

`LobbyContributors` calls `GET /github/contributors`, which proxies the GitHub API through the server. The proxy exists for two reasons: the response is cached server-side, and GitHub allows only 60 unauthenticated requests an hour per IP — calling it from every client would exhaust that quota quickly.

The strip renders nothing when the list is empty, so a repository with no contributors simply shows no section.

## An empty Developers tab is not a bug

A fresh database has no admins, so **nothing shows until someone is promoted** — that is the expected state, not a failure.

If the tab is empty and you expect it not to be, check the data first:

```sql
SELECT role, count(*) FROM "user" GROUP BY role;
```

## Note on `verified`

`Profile.verified` is a separate flag with its own badge and no relation to `role`. A user can be verified without being a developer, and the other way round. Don't conflate them when reading `toUserProfile`.
