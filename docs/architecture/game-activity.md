# Game activity — "playing X" next to a participant

A participant can share the name of the game or app they have running. Other people in the room see it under their name. It is opt-in, it can be turned off, and it only works in the desktop app — a browser cannot inspect the process list.

## Where each piece lives

```text
apps/tauri/src/game_detection/     Rust — resolves a running process to a display name
apps/client/features/app/game-activity/
├── api/detect-running-game.ts     invoke('detect_running_game'), null outside the desktop shell
├── model/hooks/use-game-activity      polls via TanStack Query, gated on the setting
└── model/hooks/use-game-activity-sync publishes the result into presence
```

The detected name travels the same path as mute and deafen state: a `presence.patch` message over the app WebSocket, into the in-memory presence store, back out to every subscriber in the room snapshot.

## Detection, in priority order

There is no public catalogue mapping an executable to a game title, so nothing is hardcoded. The name is discovered from the machine itself:

1. **Steam manifests.** Steam writes an `appmanifest_<appid>.acf` per installed game, carrying its display name and its `installdir`. A running process is matched by whether its executable path sits under `steamapps/common/<installdir>/` — Steam game binaries are often generically named, so the path is more reliable than the executable name.
2. **Executable metadata (Windows).** For anything not from Steam, the exe's version-info resource supplies `FileDescription`, falling back to `ProductName`. This is what names Blender, OBS Studio or VS Code without a table.
3. **Nothing.** No match means no activity is published.

Within each tier the **most recently started** process wins. That ordering matters more than it looks: a wallpaper tool has been running since boot, while the game the user just launched is minutes old, so ranking by longest-running would report the wallpaper forever.

The interesting engineering is the exclusion filter, not an inclusion list. System directories, `WindowsApps`, helper and updater processes and the app's own binary are dropped, and so are two categories that would otherwise dominate the status: always-on background tools (Wallpaper Engine, RGB and fan-control software, overlays) and game launchers themselves — Steam is how you start a game, not what you are playing. A process must also have been alive for at least 30 seconds, which keeps the status from flickering as short-lived processes come and go.

## Privacy

- Off is one switch away, in Settings → System. The toggle only appears on desktop.
- Only the resolved display name leaves the machine — never a path, never a command line, never a process list.
- The name is capped at 64 characters by the schema and is never persisted: it lives in the presence store and disappears when the participant leaves.
- Detection matches on the executable and its metadata, never on window titles, which routinely leak document names.

## Polling

`use-game-activity` is a TanStack Query with a 30-second `refetchInterval` rather than a hand-rolled timer, and `refetchOnWindowFocus` is off so tabbing back does not re-scan. The Steam manifest map is cached on the Rust side; the running-process check is not, since that is the part that has to stay live.
