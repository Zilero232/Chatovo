export const participantCardStyles = {
  root: '@container relative flex aspect-video w-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-white/5 transition-shadow data-[speaking=true]:ring-2 data-[speaking=true]:ring-indigo-400/80',
  stage: 'relative min-h-0 flex-1',
  videoGrid: 'grid h-full w-full auto-cols-fr grid-flow-col gap-0.5',

  audioStage:
    'flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800/80 via-neutral-900 to-neutral-950',

  visualizer: 'flex h-[20cqmin] items-end justify-center gap-[2cqmin]',
  bar: 'w-[4cqmin] min-w-1.5 rounded-full bg-white/20 transition-colors data-[lk-highlighted=true]:bg-indigo-400',

  badges: 'absolute top-2 right-2 flex items-center gap-1',
  badge:
    'flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 font-medium text-[10px] text-white backdrop-blur',
  badgeIcon: 'size-3',

  metadata:
    'absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pt-6 pb-2 text-xs text-white',
  micIcon: 'size-3.5 shrink-0 text-red-400',
  name: 'truncate font-medium',
} as const;
