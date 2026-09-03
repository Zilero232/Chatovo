# Review account

Chatovo is behind authentication, so a RuStore moderator needs a working test
account. The credentials go into the "note to the moderator" field when the
version is created (180 characters max) and into the version description.

## Credentials

Create a dedicated user before submitting:

```text
Email:    review@chatovo.ru
Password: <pick a strong one, keep it in a password manager>
```

The address has to be verified — walk the signup flow once by hand.

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

Before submitting a version:

1. Create the user `review@chatovo.ru` with a known password
2. Create the public room **Review Room** with no password
3. Check that `https://api.chatovo.ru` resolves over a mobile network, not only
   from the office
4. Check that `wss://livekit.chatovo.ru` is reachable from there too — without it
   voice never comes up and the moderator sees the main feature broken

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
