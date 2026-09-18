# Servers, categories and channels

Discord-style hierarchy on top of the existing rooms: a **Server** (guild) owns **Categories**, which own **Channels**. Members hold **Roles** with a permission bitmask, and every category or channel may carry **overwrites** that allow or deny bits for a role or a single member.

```text
Server
├── ServerRole[]            everyone (isDefault) + custom roles, ordered by position
├── ServerMember[]          userId + nickname + role links
├── ServerInvite[]          code, maxUses, expiresAt
└── Category[]              position, overwrites
    └── Room (channel)      type: text | voice | announcement | forum
        ├── ChannelOverwrite[]
        ├── Thread[]        text + forum only
        └── ChannelRead[]   per-user read state
```

## The channel is still a `Room`

`Room` was not renamed. It gained `type`, `serverId`, `categoryId`, `position`, `topic`, `slowMode`, `nsfw`, `userLimit` and `archivedAt`; a channel is a room whose `serverId` is set. **Standalone rooms are gone** — the old lobby room browser, room passwords and the create/edit/delete room API were removed, so the only rows with `serverId = null` are DMs.

This keeps `Message.roomId`, the LiveKit room id, the in-memory grant store and the realtime room subscriptions untouched — all of them key on `room.id`. The price is that `Room.name` is no longer globally unique: uniqueness is `@@unique([serverId, type, name])`, so a lookup by name alone is a bug.

Schema files: `apps/server/prisma/schema/{server,room,permission,thread}.prisma`.

## Permissions

The bitmask lives in `packages/schemas/src/permissions/` and is shared by both apps. Masks cross the wire as **decimal strings** (`serializePermissions` / `parsePermissions`) because JSON has no bigint.

Resolution order matches Discord:

1. base = OR of the default role and every role the member holds;
2. category role overwrites (deny, then allow), then the category member overwrite;
3. channel role overwrites, then the channel member overwrite;
4. `administrator` or server ownership short-circuits to every bit.

Server side this is `resolveChannelPermissions` / `resolveServerChannelPermissions` in `apps/server/src/lib/resolve-member-permissions/`, and the guards `assertServerPermission` / `assertChannelPermission` / `assertMemberHierarchy` in `src/lib/assert-permission/`. A moderator can only grant bits they hold themselves, and can only act on members and roles that sit below their own top role.

Two shared guards were made channel-aware rather than duplicated:

- `assertRoomTier` (behind `assertCanAccessRoom` / `assertCanViewRoom`) checks `viewChannel` / `readMessageHistory` when the room has a `serverId`.
- `LivekitService.issueRoomToken` checks `connect` for voice channels and skips the password gate — channels use overwrites, not passwords.

Posting into a channel goes through `assertCanPost` in the chat module: `sendMessages` (or `sendMessagesInThreads`), the announcement-only restriction and the per-channel slow mode.

A **private channel** is not a password (room passwords no longer exist): creating one writes two overwrites — deny `viewChannel` for `@everyone`, allow it for the creator — and the tree simply omits channels the viewer cannot see.

**Moderation** has three levels. A **timeout** (`ServerMember.mutedUntil`) keeps reading but blocks posting and voice — enforced by `assertNotTimedOut` in `assertCanPost` and in the LiveKit token. A **kick** drops the membership row. A **ban** (`ServerBan`) drops it and blocks rejoining, checked when an invite is redeemed.

## API surface

| Area | Routes |
|---|---|
| Servers | `GET/POST /servers`, `GET/PATCH/DELETE /servers/:id`, `POST /servers/:id/leave`, `POST /servers/:id/transfer/:userId` |
| Members | `GET /servers/:id/members`, `PATCH/DELETE /servers/:id/members/:userId` |
| Bans | `GET /servers/:id/bans`, `POST/DELETE /servers/:id/bans/:userId` |
| Icon | `POST /servers/:id/icon` (multipart), `DELETE /servers/:id/icon` |
| Roles | `GET/POST /servers/:id/roles`, `PATCH /servers/:id/roles/reorder`, `PATCH/DELETE /servers/:id/roles/:roleId` |
| Invites | `GET/POST /servers/:id/invites`, `DELETE /servers/:id/invites/:inviteId`, `GET /servers/invites/:code`, `POST /servers/join` |
| Tree | `GET /servers/:id/tree` — categories, visible channels and the viewer's mask per channel in one request |
| Channels | `POST /servers/:id/channels`, `PATCH /servers/:id/channels/reorder`, `GET/PATCH/DELETE /channels/:id` |
| Categories | `POST /servers/:id/categories`, `PATCH /servers/:id/categories/reorder`, `PATCH/DELETE /servers/:id/categories/:categoryId` |
| Overwrites | `GET/POST /channels/:id/overwrites`, `DELETE /channels/:id/overwrites/:overwriteId`, same under `/servers/:id/categories/:categoryId/overwrites` |
| Threads | `GET/POST /channels/:id/threads`, `PATCH/DELETE /threads/:id`, `GET/POST /channels/:id/thread-tags`, `DELETE /thread-tags/:id` — forum threads carry tags, filterable in the forum view |
| Read state | `GET /servers/:id/read-states`, `POST /channels/:id/read`, `POST /channels/:id/mute` |
| Chat | `POST /chat/messages` accepts `threadId` / `replyToId`; `GET /chat/messages?threadId=`; `GET /chat/pins`, `PATCH /chat/messages/:id/pin`; `PUT/DELETE /chat/messages/:id/reactions` |
| Voice directory | `GET /channels/voice` — every voice channel the viewer can see, for friend activity |

## Realtime

Clients subscribe to their servers with the `server.subscribe` op (mirrors `subscribe` for rooms); the server fans server-scoped events out through `emitServerEvent`. Events: `channel.*`, `category.*`, `server.update/delete`, `member.join/update/leave`, `role.upsert/delete`, `permissions.update`, `thread.upsert/delete`, `read.state` (to one user) and `channel.typing` (room-scoped, throttled per user). `chat.message/edit/delete` now carry `serverId` and `threadId` so the client can route them to the right cache and refresh the right server's unread state.

`chat.reaction` carries the regrouped reaction list after a toggle. On the client `widgets/server/server-realtime-sync` translates these into react-query invalidations and feeds the small activity/typing store in `entities/server/channel/model/stores`.

## Messages

The message list is a flat Discord-style feed: avatar gutter, name and time on one line, consecutive messages from the same author grouped under a hover-revealed timestamp, and a floating action bar on hover. A message that mentions you is tinted and carries a left accent bar.

Beyond plain text a message carries `replyToId`, `pinned`, its `MessageReaction[]` and inline mentions. Mentions are stored as `<@userId>` / `<@&roleId>` tokens plus a literal `@everyone`; `packages/schemas/src/chat/mentions.ts` parses and formats them, the composer autocompletes on `@`, and `renderMentions` turns the tokens back into chips. Sending resolves the mentioned members and bumps their `ChannelRead.mentionCount`, so the sidebar can show a mention badge. `@everyone` only counts for members holding `mentionEveryone`.

## Client layout

- `entities/server/{server,channel,member,invite,thread,permission}` — hooks over the API, permission helpers (`canInChannel`, `canOnServer`), the channel tree grouping, `ChannelIcon`, `PermissionToggleList` / `PermissionOverwriteList`.
- `features/server/*` — dialogs and form hooks: create/join server, join-voice, manage-channel (incl. the overwrite editor), manage-category, threads, settings (overview / roles / members / invites).
- `widgets/server/server-rail` — the narrow guild strip; `server-channels-panel` — the tree with categories, unread dots, voice participants and per-row menus; `channel-view` — header + text / voice / forum bodies + members / threads side panels.
- `views/lobby` mirrors Discord's home: a header bar with Online / All / Servers tabs, the friend list in the middle and an **Active now** panel on the right; the left column (`widgets/room/channels-panel`) holds the search trigger, the Friends entry and the direct-message list above the user bar.
- `views/server` reads `?id=&channel=&thread=` (query params, see [room-session.md](room-session.md) for why not path segments); `views/invite` reads `?code=`. `views/lobby` is now the Discord-style home: your servers plus friend activity, with no room browser.

Joining a voice channel opens the room session in place (`useJoinVoiceChannel`), so the server page stays put and the call rides in the session host like Discord's voice bar; "expand" pushes to `/room?id=`.
