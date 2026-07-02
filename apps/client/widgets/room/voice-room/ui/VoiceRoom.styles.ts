export const voiceRoomStyles = {
  root: 'h-full p-0 sm:p-4 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500',
  frame: 'glass flex h-full flex-col overflow-hidden rounded-none sm:rounded-2xl',
  room: 'relative flex h-full flex-col',

  body: 'relative flex min-h-0 flex-1 flex-col',

  controls:
    'flex items-center gap-1 border-t border-white/8 bg-linear-to-t from-white/4 to-transparent p-2 pb-[max(0.625rem,var(--safe-area-bottom))] sm:gap-2 sm:p-2.5 sm:pb-2.5',
  controlBarWrap:
    'flex min-w-0 flex-1 justify-start overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:justify-center sm:[mask-image:none]',
  sideActions: 'flex shrink-0 items-center gap-1 sm:gap-1.5',
  desktopInvite: 'hidden md:block',
} as const;
