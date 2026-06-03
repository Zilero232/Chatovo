export const voiceRoomStyles = {
  root: 'h-full p-2 sm:p-4',
  frame: 'glass flex h-full flex-col overflow-hidden rounded-2xl',
  room: 'relative flex h-full flex-col',

  body: 'relative flex min-h-0 flex-1 flex-col',

  controls:
    'flex items-center gap-1.5 border-t border-white/8 bg-linear-to-t from-white/4 to-transparent p-2.5 sm:gap-2',
  controlBarWrap: 'flex min-w-0 flex-1 justify-center',
  chatButton: 'size-9! shrink-0 sm:size-10!',
} as const;
