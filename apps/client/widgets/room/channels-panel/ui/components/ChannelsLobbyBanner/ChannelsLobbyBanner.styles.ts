export const channelsLobbyBannerStyles = {
  root: 'flex flex-1 flex-col gap-3 overflow-y-auto p-3',

  card: 'flex flex-col items-center gap-3 rounded-xl border border-white/10 glass p-5 text-center',
  iconBox:
    'flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet/30 to-brand-cyan/30 text-foreground',
  icon: 'size-6',
  text: 'flex flex-col gap-1',
  title: 'font-semibold text-sm',
  hint: 'text-muted-foreground text-xs',
  cta: 'w-full',

  tip: 'mt-auto flex items-start gap-2 rounded-lg border border-white/8 bg-white/4 p-3 text-muted-foreground text-xs backdrop-blur-sm',
  tipIcon: 'size-3.5 shrink-0 translate-y-px text-brand-cyan',
} as const;
