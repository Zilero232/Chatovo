# Store listing

Copy and asset requirements for the RuStore console. Limits come from the
[publication requirements](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/app-publication).

The app must offer Russian or English (Chatovo ships both plus a switcher) —
otherwise publication is declined.

## Name

Chatovo

The console caps the name at 30 characters; the API field `appName` allows 50.

## App type

`MAIN` (not a game).

## Category

Communication (at most 2 categories).

## Short description (80 characters max)

**RU:** Голосовые и видео-комнаты в реальном времени

**EN:** Real-time voice and video rooms

## Full description (4000 characters max, collapsed at 2000 in the UI)

```text
Chatovo — мессенджер с голосовыми и видео-комнатами в реальном времени.

Создайте комнату в один клик, отправьте ссылку друзьям и начинайте разговор.
Без громоздких списков серверов — только комнаты.

Возможности:
• Голосовые и видео-комнаты с низкой задержкой (WebRTC)
• Публичные и приватные комнаты с паролем
• Текстовый чат с вложениями
• Профиль: аватар, описание, ссылка
• Вход по email
• Интерфейс на русском и английском

Правила сообщества и жалобы на контент — в разделе «Условия использования»
внутри приложения. Пожаловаться на пользователя или сообщение можно прямо в
комнате, а также письмом на zilero@chatovo.ru.

Поддержка: zilero@chatovo.ru
Политика конфиденциальности: https://chatovo.ru/privacy
```

## Full description — EN

```text
Chatovo is a real-time messenger built around voice and video rooms.

Create a room in one click, share the link, and start talking. No cluttered
server lists — just rooms.

Features:
• Low-latency voice & video rooms (WebRTC)
• Public and password-protected private rooms
• Text chat with file attachments
• Profile: avatar, bio, external link
• Sign in with email
• English and Russian UI

Community rules and content reporting live under "Terms of Service" inside the
app. You can report a user or a message straight from a room, or write to
zilero@chatovo.ru.

Support: zilero@chatovo.ru
Privacy: https://chatovo.ru/privacy
```

## Age rating

**16+**

RuStore's scale: `0+`, `6+`, `12+`, `16+`, `18+` (the `ageLegal` API field).

Rationale: user-generated content with no pre-moderation — text, voice, video and
files. The rating has to cover the worst content users can produce, so 12+ and
below do not pass for an open voice chat. Details in
[moderation.md](moderation.md).

## Developer contacts

| Field | Value |
|-------|-------|
| email | `zilero@chatovo.ru` |
| website | `https://chatovo.ru` |
| vkCommunity | — |
| maxMessenger | — |

## What's new (5000 characters max)

**RU:** Первый релиз для Android — голосовые комнаты, чат, вход по email.

**EN:** Initial Android release — voice rooms, text chat, email sign-in.

For every later version the text is taken from the GitHub Release body and
passed as `whatsNew` when the draft is created.

## Note to the moderator (180 characters max)

```text
Тестовый аккаунт и шаги проверки — в описании версии. Микрофон нужен только для
голосовых комнат, запрашивается по действию пользователя.
```

## Graphics

| Asset | Requirements |
|-------|--------------|
| Icon | 512×512 px, PNG/JPG, up to 3 MB, background filled edge to edge (no transparency) |
| Phone screenshots | at least 3, at most 10 active; PNG/JPG; any side 320–3840 px, no larger than 2160×3840; up to 3 MB |
| Tablet screenshots | same dimensions, up to 5 MB |
| Video | up to 256 GB, up to 4K, 1–2 minutes recommended |

Aspect ratio is 16:9 for landscape and 9:16 for portrait. Mixing orientations
inside one set is not allowed. Uploading an eleventh screenshot deactivates the
earliest one.

Suggested screens: auth, lobby, voice room, chat, settings.

## FAQ (optional)

Up to 10 question/answer pairs: question up to 120 characters, answer up to 500.

## Price

The app is free — leave `priceValue` empty.

## Publication

`publishType: MANUAL` — once moderation passes, the version is published by hand
from the console. The CI upload creates a draft and submits it for review, but
never releases it to users.
