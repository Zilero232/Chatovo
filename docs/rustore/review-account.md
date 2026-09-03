# Review account

Chatovo is behind authentication, so a RuStore moderator needs a working test
account. The credentials go into the "note to the moderator" field when the
version is created (180 characters max) and into the version description.

## Credentials

Create a dedicated user before submitting:

```text
Email:    review@chatovo.ru
Password: ChatovoReview2026!
```

The account exists on production and owns the public room **Review Room**; both
were created through the app itself. The password is deliberately not a secret —
it ships to RuStore inside the version description, so a moderator can sign in.
Treat the account as public: never give it moderation rights.

## Instructions for the moderator

```text
1. Open the app.
2. Sign in with the credentials above.
3. Allow the microphone when asked — it is only needed for voice rooms.
4. From the lobby, open the public room "Review Room" or create a new one.
5. Tap the microphone button to join voice.
6. Open the chat panel and send a message.

If sign-in fails, contact zilero@chatovo.ru
```

## Server-side preparation

Both the account and the room already exist. What still has to be re-checked
before every submission:

1. `https://api.chatovo.ru` resolves over a mobile network, not only from the
   office
2. `wss://livekit.chatovo.ru` is reachable from there too — without it voice
   never comes up and the moderator sees the main feature broken
3. The room **Review Room** is still public and still there

## Store screenshots

`assets/screenshots/` holds the five 1080x2400 captures the listing uses, taken
on an Android 15 emulator against production:

| File | Screen |
|------|--------|
| `01-sign-in.png` | sign-in, with the privacy and terms links |
| `02-lobby.png` | lobby: room counts, Continue, room list |
| `03-voice-room.png` | a voice room with the call controls |
| `04-chat.png` | room chat |
| `05-settings.png` | profile settings |

Re-take them whenever the UI changes shape. `assets/icon-512.png` is the store
icon: 512x512, flattened onto the brand background, no alpha.

## Age rating

**16+** — the rationale and the UGC requirements are in
[moderation.md](moderation.md).

## Permissions

A moderator checks that every requested permission is justified:

| Permission | Justification in the listing |
|------------|------------------------------|
| `RECORD_AUDIO` | Voice rooms; requested when joining voice |
| `CAMERA` | Video and screen share; requested when the camera is turned on |
| `MODIFY_AUDIO_SETTINGS` | Switching between speaker and headset during a call |
| `POST_NOTIFICATIONS` | Notifications for incoming calls and messages |
