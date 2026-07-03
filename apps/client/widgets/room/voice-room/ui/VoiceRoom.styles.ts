export const voiceRoomStyles = {
  root: 'h-full p-0 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500',
  frame: 'flex h-full flex-col overflow-hidden',
  room: 'relative flex h-full flex-col',

  body: 'relative flex min-h-0 flex-1 flex-col',

  controls:
    'flex h-16 shrink-0 items-center gap-1 border-t border-white/8 bg-white/2 px-2 backdrop-blur-sm sm:gap-2 sm:px-2.5 max-md:pb-[max(0.625rem,var(--safe-area-bottom))]',
  controlBarWrap:
    'flex min-w-0 flex-1 justify-start overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:justify-center sm:[mask-image:none]',
  sideActions: 'flex shrink-0 items-center gap-1 sm:gap-1.5',
  desktopInvite: 'hidden md:block',
} as const;
