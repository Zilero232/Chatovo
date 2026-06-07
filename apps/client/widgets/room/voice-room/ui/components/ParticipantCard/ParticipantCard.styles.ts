export const participantCardStyles = {
  root: '@container relative flex aspect-video w-full flex-col overflow-hidden rounded-2xl bg-black/40 border border-white/10 transition-all animate-in fade-in zoom-in-95 fill-mode-both duration-300 data-[speaking=true]:border-brand-cyan/60 data-[speaking=true]:shadow-[0_0_24px_-4px_oklch(0.82_0.16_200/0.6)]',
  stage: 'relative min-h-0 flex-1',
  videoGrid:
    'grid h-full w-full auto-cols-fr grid-flow-col gap-0.5 animate-in fade-in duration-300',

  audioStage:
    'relative flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-900 animate-in fade-in duration-300',
  tint: 'pointer-events-none absolute inset-0',

  avatarHalo:
    'pointer-events-none absolute size-[38cqmin] rounded-full bg-brand-cyan/0 blur-[12cqmin] transition-all duration-300',
  avatarHaloSpeaking: 'bg-brand-cyan/30',

  avatar:
    'relative size-[28cqmin] min-h-12 min-w-12 rounded-full ring-2 ring-white/10 transition-all duration-200',
  avatarSpeaking: 'ring-[3.5px] ring-brand-cyan shadow-[0_0_22px_-2px_oklch(0.82_0.16_200/0.8)]',
  avatarFallback:
    'bg-linear-to-br from-brand-violet/50 to-brand-cyan/50 font-semibold text-[12cqmin] text-white',

  badges: 'absolute top-2 right-2 flex items-center gap-1',
  badge:
    'flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2 py-0.5 font-medium text-[10px] text-white backdrop-blur-md',
  badgeIcon: 'size-3',

  metadata:
    'absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-linear-to-t from-black/75 to-transparent px-3 pt-8 pb-[3cqmin] text-xs text-white',
  micIcon: 'size-3.5 shrink-0 text-destructive drop-shadow-[0_0_6px_oklch(0.7_0.22_22/0.7)]',
  name: 'truncate font-medium',
  nameTrigger:
    'min-w-0 rounded outline-hidden hover:underline focus-visible:ring-2 focus-visible:ring-brand-cyan',
} as const;
