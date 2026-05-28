export const voiceRoomStyles = {
  root: 'h-full p-2 sm:p-4',
  frame: 'glass flex h-full flex-col overflow-hidden rounded-2xl',
  room: 'flex h-full flex-col',

  header:
    'flex items-center gap-2 border-b border-white/8 bg-linear-to-b from-white/4 to-transparent px-3 py-2.5 sm:px-4 sm:py-3.5',
  headerIcon:
    'flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet/30 to-brand-cyan/30 text-foreground shadow-[0_4px_16px_-4px_oklch(0.7_0.22_295/0.5)]',
  headerInfo: 'flex min-w-0 flex-1 flex-col leading-tight',
  headerTitle: 'truncate font-semibold text-sm sm:text-base',

  body: 'relative flex min-h-0 flex-1 flex-col',

  controls:
    'relative flex items-center justify-center border-t border-white/8 bg-linear-to-t from-white/4 to-transparent p-2.5',
  controlBar: 'flex justify-center',
  controlBarPttIdle:
    '[&_button[data-lk-source="microphone"]]:!bg-white/8 [&_button[data-lk-source="microphone"]]:!text-muted-foreground',
  controlBarPttActive:
    '[&_button[data-lk-source="microphone"]]:!bg-brand-cyan/20 [&_button[data-lk-source="microphone"]]:!text-brand-cyan [&_button[data-lk-source="microphone"]]:!shadow-[0_0_18px_-4px_oklch(0.82_0.16_200/0.7)]',
  chatButton: 'absolute right-2',
} as const;
