# Data safety (Play Console)

Use when filling **App content → Data safety**.

## Summary

| Question | Answer |
|----------|--------|
| Collects or shares user data? | Yes |
| Encrypted in transit? | Yes (HTTPS / WSS) |
| Users can request deletion? | Yes — zilero@chatovo.ru |
| Independent security review? | No |

## Data types

### Personal info

| Type | Collected | Shared | Purpose |
|------|-----------|--------|---------|
| Name | Yes | No | Account |
| Email | Yes | No | Account, communications |
| User IDs | Yes | No | Account |

### Messages

| Type | Collected | Shared | Purpose |
|------|-----------|--------|---------|
| Other in-app messages | Yes | LiveKit (realtime relay) | App functionality |
| Photos / files | Yes | No | Chat attachments, avatar |

### App activity

| Type | Collected | Shared | Purpose |
|------|-----------|--------|---------|
| App interactions | Yes | No | Rooms, presence |

### Device or other IDs

| Type | Collected | Shared | Purpose |
|------|-----------|--------|---------|
| Device or other IDs | Yes (user agent in sessions) | No | Security |

### Audio / video

| Type | Collected | Shared | Purpose |
|------|-----------|--------|---------|
| Voice or sound recordings | Yes (realtime, not stored) | LiveKit | Voice chat |
| Videos | Yes (realtime, not stored) | LiveKit | Video chat |

## Optional vs required

- Email: **required** for account
- Profile fields: **optional**
- Microphone / camera: **optional** (runtime permission, required for voice/video)

## Third parties

- LiveKit (WebRTC SFU — realtime media and data channels)
- SMTP provider (transactional email)
- Google Play (distribution on Android)

## Security practices

- Data encrypted in transit
- Users can request account/data deletion via zilero@chatovo.ru

## App content declarations

| Declaration | Answer |
|-------------|--------|
| Ads | No |
| Target audience | 13+ |
| UGC | Yes (chat, profiles) |
| Special app types (finance, news, etc.) | None |
