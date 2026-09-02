# Invisible mode

An admin can join any voice room hidden: no password, and nobody sees or hears them. It is a real hide, enforced by the server and LiveKit, not a UI trick — a plain user cannot fake it, and no client can reveal the hidden admin.

## The security boundary

The only thing that grants invisibility is the server-verified role. The client sends an `invisible` flag, but it is meaningless on its own:

```ts
// modules/livekit/lib/resolve-invisible
resolveInvisible({ requested, isAdmin }) => Boolean(requested) && isAdmin;
```

`isAdmin` comes from the session (`session.user.role === 'admin'`), never from the request body, so a forged flag from a non-admin resolves to `false`. This is the guarantee the whole feature rests on, and it is the one thing covered by a test that must never regress.

## What the token grants

When `isInvisible` is true, `issueRoomToken` changes three things:

- **Skips the password check** — `assertRoomAccess` is not called.
- **Sets `hidden: true`** on the LiveKit grant. The SFU then keeps the participant out of everyone else's participant list.
- **Drops `canPublish` / `canPublishData`** — an invisible admin can listen but not speak, so nothing leaks through an audio track.

The token metadata also carries `invisible: true`. This is a **second** flag, separate from the LiveKit grant, and it exists only for the server's own presence layer.

## Why the metadata flag is needed

Chatovo keeps its own participant list in `presence-store`, built from two sources, and **neither is covered by LiveKit's `hidden` grant**:

1. **Webhooks** — LiveKit may still POST `participant_joined` for a hidden participant. `webhook.service` drops the event when `isInvisibleParticipant(metadata)` is true.
2. **`syncRoom`** — reconciles the store against `roomService.listParticipants()`, which returns hidden participants. The reconcile filters them out by both `permission.hidden` and the metadata flag.

Without these two filters the admin would be hidden inside LiveKit but visible in Chatovo's own list — the hide would leak through the app's presence channel.

The `invisible` flag is deliberately **not** part of `participantMetadataSchema`. That schema feeds the presence stream sent to every client; parsing metadata through it silently drops `invisible`, so the flag can never travel to another user. `isInvisibleParticipant` reads the raw JSON instead.

## The client side

- **The toggle** lives in the system settings tab and renders only for `isAdmin`. It is stored in `settings.system.invisibleMode`.
- **The token request** — `useEnterRoom` and `useRoomToken` send `invisible: isAdmin && settings.system.invisibleMode`. A non-admin never sends `true`, and even if they did the server rejects it.
- **The join/leave sounds** — `useVoiceRoomSounds` suppresses the admin's *own* join and leave chimes while invisible. Other people never hear them either, because a hidden participant emits no `ParticipantConnected` to their clients.

## Adding a surface that lists participants

Any new code that reads the participant roster must go through `presence-store` or LiveKit's own participant hooks — both already exclude hidden participants. Do not call `roomService.listParticipants()` and render the result directly; filter `permission.hidden` and `isInvisibleParticipant(metadata)` as `syncRoom` does, or the hide leaks.
