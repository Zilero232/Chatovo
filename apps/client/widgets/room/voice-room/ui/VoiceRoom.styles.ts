export const voiceRoomStyles = {
  root: 'h-full p-0 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500',
  frame: 'flex h-full flex-col overflow-hidden',
  room: 'relative flex h-full flex-col',

  body: 'relative flex min-h-0 flex-1 flex-col overflow-hidden',
  ambience: 'lobby-ambience opacity-70',
  orbViolet: 'lobby-ambience-orb lobby-ambience-orb-violet scale-75 opacity-60',
  orbCyan: 'lobby-ambience-orb lobby-ambience-orb-cyan scale-90 opacity-50',

  controls:
    'surface-bar relative flex min-h-12 shrink-0 items-center gap-1.5 border-t px-2 pt-1 sm:min-h-14 sm:gap-2 sm:px-3 sm:pt-1.5 max-md:pb-[max(0.25rem,var(--safe-area-bottom))]',
  controlsAccent: 'accent-top-line',
  controlBarWrap:
    'flex min-w-0 flex-1 items-center justify-start overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:justify-center sm:[mask-image:none]',
  sideActions: 'flex shrink-0 items-center gap-1.5 sm:gap-2',
  desktopInvite: 'hidden md:block',
} as const;
