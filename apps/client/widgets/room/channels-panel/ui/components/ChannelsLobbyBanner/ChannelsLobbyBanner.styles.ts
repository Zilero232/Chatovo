export const channelsLobbyBannerStyles = {
  root: 'flex flex-1 flex-col gap-3 overflow-y-auto p-3',

  card: 'relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-white/12 glass p-5 text-center shadow-[0_12px_32px_-16px_oklch(0.7_0.2_270/0.45)]',
  cardGlow:
    'pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-brand-violet/0 via-brand-cyan/60 to-brand-violet/0',
  cardWash:
    'pointer-events-none absolute -top-10 right-0 size-24 rounded-full bg-brand-violet/20 blur-2xl',
  iconBox:
    'relative flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet/35 to-brand-cyan/35 text-foreground shadow-[0_0_20px_-6px_oklch(0.7_0.22_295/0.8)]',
  icon: 'size-6',
  text: 'relative flex flex-col gap-1',
  title: 'font-semibold text-sm',
  hint: 'text-muted-foreground text-xs leading-relaxed',
  cta: 'relative w-full',

  tip: 'mt-auto flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-muted-foreground text-xs backdrop-blur-sm',
  tipIcon: 'size-3.5 shrink-0 translate-y-px text-brand-cyan',
} as const;
