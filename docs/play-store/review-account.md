# Review account & app access

Play Console → **App content → App access**

## Credentials

Create a dedicated test user before submission:

```
Email:    zilero@chatovo.ru
Password: <set a strong password>
```

Ensure email is verified (complete signup flow manually once).

## Instructions for reviewers

```
1. Open the app.
2. Tap Sign in and use the credentials above.
3. Allow microphone permission when prompted (required for voice rooms).
4. From the lobby, open the public room named "Review Room" or create a new room.
5. Tap the microphone button to join voice.
6. Optional: open chat panel and send a test message.

If login fails, contact zilero@chatovo.ru.
```

## Prepare on server

Before review:

1. Create user `zilero@chatovo.ru` with known password
2. Create public room **Review Room** (no password)
3. Verify API `https://api.chatovo.ru` is reachable from mobile networks

## Content rating (IARC) hints

- Communication / social: **Yes**
- User-generated content: **Yes**
- Voice chat with others: **Yes**
- Expected rating: **Teen 13+** (adjust per questionnaire answers)

## UGC note

Chatovo has text chat and profiles. Privacy Policy and Terms describe reporting via zilero@chatovo.ru.
