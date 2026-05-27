export const voiceRoomStyles = {
  root: 'h-full p-2 sm:p-4',
  frame: 'flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm sm:rounded-2xl',
  room: 'flex h-full flex-col',

  // Header — room icon + name + live participant count + connection bars.
  header:
    'flex items-center gap-2 border-b bg-gradient-to-b from-card to-card/60 px-3 py-2 sm:px-4 sm:py-3',
  headerIcon:
    'flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary',
  headerInfo: 'flex min-w-0 flex-1 flex-col leading-tight',
  headerTitle: 'truncate font-semibold text-sm sm:text-base',
  headerCount: 'flex items-center gap-1 text-muted-foreground text-xs',
  headerCountDot: 'size-1.5 animate-pulse rounded-full bg-emerald-400',

  // `relative` anchors the ConnectingOverlay, which covers the grid until the
  // LiveKit connection is established.
  body: 'relative flex min-h-0 flex-1 flex-col',

  // ControlBar centred; the chat toggle pinned to the right edge.
  controls: 'relative flex items-center justify-center border-t bg-card/40 p-2',
  controlBar: 'flex justify-center',
  // PTT mode: keep the mic button visible but mute its colour so it reads as
  // "hotkey-driven" — not an interactive mute toggle.
  controlBarPttIdle:
    '[&_button[data-lk-source="microphone"]]:!bg-muted/40 [&_button[data-lk-source="microphone"]]:!text-muted-foreground',
  // PTT key currently held — solid emerald fill so the user has unambiguous
  // feedback they're transmitting right now.
  controlBarPttActive:
    '[&_button[data-lk-source="microphone"]]:!bg-emerald-500/15 [&_button[data-lk-source="microphone"]]:!text-emerald-300',
  chatButton: 'absolute right-2',
} as const;
