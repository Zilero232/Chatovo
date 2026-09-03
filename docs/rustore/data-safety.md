# Personal data

What Chatovo collects, why, and who it is shared with. Needed when filling in the
RuStore console and as the basis for answers to a moderator.

## RuStore requirements

[App requirements](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/requirement-apps):

| Requirement | Status |
|-------------|--------|
| Personal data operator status | **Not done** — filed with Roskomnadzor before publication |
| Privacy policy in Russian | Done — `https://chatovo.ru/privacy` |
| User informed about collection | Done — the `/privacy` page |
| User consent to collection | Done — checkbox linking `/terms` and `/privacy` in the sign-up form |
| No selling of collected data | Data is never sold or handed to advertisers |
| Encryption in transit | Done — HTTPS / WSS |
| Account deletion on request | Done — `zilero@chatovo.ru` |

Operator status is the only item that is settled outside the code. Everything
else is in place, see [moderation.md](moderation.md).

## What is collected

### Account

| Type | Required | Purpose |
|------|----------|---------|
| Email | Required | Sign-in, account recovery, transactional mail |
| Name / display name | Required | Identity in rooms |
| User id | Required | Running the service |
| Password | Required | Stored as a hash, never in plain text |

### Profile

| Type | Required | Purpose |
|------|----------|---------|
| Avatar | Optional | Shown in rooms |
| Bio, banner colour, link | Optional | Profile presentation |

### Communication

| Type | Required | Purpose |
|------|----------|---------|
| Text messages | On user action | Room chat and direct messages |
| Files and images | On user action | Chat attachments |
| Voice | On user action | Voice rooms — relayed in real time, never recorded or stored |
| Video | On user action | Video and screen share — relayed in real time, never recorded or stored |

### Technical data

| Type | Required | Purpose |
|------|----------|---------|
| User agent, session time and IP | Automatic | Security, the active sessions list, incident analysis |
| Device push token | When notifications are enabled | Delivering call and message notifications |
| In-app activity | Automatic | Room presence, online status |

## Android permissions

| Permission | Requested when | Required |
|------------|----------------|----------|
| `RECORD_AUDIO` | Joining a voice room | Optional — text chat works without it |
| `CAMERA` | Turning the camera on | Optional |
| `MODIFY_AUDIO_SETTINGS` | Alongside the microphone | Optional |
| `POST_NOTIFICATIONS` | On first launch | Optional |

No permission is requested at startup without a user action.

## Sharing with third parties

| Recipient | What is shared | Why |
|-----------|----------------|-----|
| LiveKit (self-hosted SFU) | Voice, video, data channels | Real-time media relay |
| SMTP provider | Email address | Address verification, password reset |
| Firebase Cloud Messaging (Google) | Push token, notification title | Push delivery on Android |
| RuStore (VK) | Install and update events | App distribution |

Nothing is shared with ad networks or third-party analytics: the app carries no
advertising.

## Retention

| Data | Retained for |
|------|--------------|
| Account and profile | While the account is active |
| Messages and attachments | Until deleted by the user or with the account |
| Session logs | A limited period needed for security |
| Voice and video | Not stored — relayed only |

## Deletion

Request to `zilero@chatovo.ru`. The account, the profile, messages and uploaded
files are removed.

## Other declarations

| Declaration | Answer |
|-------------|--------|
| Advertising | No |
| In-app purchases | No |
| User-generated content | Yes — chat, profiles, voice |
| Age rating | 16+ |
| Independent security audit | Not performed |
