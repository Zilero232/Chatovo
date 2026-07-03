export const lobbyHeaderStyles = {
  root: 'relative overflow-hidden rounded-2xl border border-white/12 glass p-5 shadow-[0_20px_60px_-24px_oklch(0.7_0.2_270/0.45)] sm:p-8',

  grid: 'lobby-header-grid',
  accent:
    'pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-brand-violet/0 via-brand-cyan/70 to-brand-fuchsia/0',
  wash: 'pointer-events-none absolute -top-28 right-[-10%] size-64 rounded-full bg-brand-violet/20 blur-3xl',
  washAlt:
    'pointer-events-none absolute -bottom-24 left-[-5%] size-52 rounded-full bg-brand-cyan/16 blur-3xl',

  inner: 'relative flex flex-col gap-6',

  topRow: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6',
  identity: 'flex min-w-0 items-center gap-3.5 sm:gap-4',
  avatarWrap:
    'relative shrink-0 rounded-full bg-linear-to-br from-brand-cyan via-brand-violet to-brand-fuchsia p-px shadow-[0_0_24px_-4px_oklch(0.7_0.22_295/0.7)]',
  avatar: 'size-12 ring-2 ring-background/60 sm:size-14',
  avatarFallback: 'gradient-brand font-semibold text-base text-white sm:text-lg',
  text: 'flex min-w-0 flex-col gap-1.5',
  title: 'truncate font-bold text-2xl tracking-tight sm:text-[1.85rem]',
  titleName: 'gradient-text',
  subtitle: 'max-w-md text-muted-foreground text-sm leading-relaxed',

  versionPill:
    'inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-brand-cyan/25 bg-brand-cyan/8 px-3 py-1.5 shadow-[0_0_20px_-8px_oklch(0.82_0.16_200/0.8)] backdrop-blur-sm transition-colors hover:border-brand-cyan/40 hover:bg-brand-cyan/12 sm:self-auto',
  versionIcon: 'size-3.5 text-brand-cyan',
  versionText: 'font-medium text-foreground/90 text-xs tabular-nums',

  stats: 'grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3',
  stat: 'surface-card group/stat relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 transition-colors hover:border-white/16 data-[tone=live]:hover:border-brand-cyan/30 data-[tone=online]:hover:border-brand-lime/30 data-[tone=rooms]:hover:border-brand-violet/30',
  statGlow:
    'pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover/stat:opacity-100 data-[tone=live]:bg-brand-cyan/6 data-[tone=online]:bg-brand-lime/6 data-[tone=rooms]:bg-brand-violet/6',
  statIconWrap:
    'relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 data-[tone=live]:border-brand-cyan/25 data-[tone=live]:bg-brand-cyan/10 data-[tone=online]:border-brand-lime/25 data-[tone=online]:bg-brand-lime/10 data-[tone=rooms]:border-brand-violet/25 data-[tone=rooms]:bg-brand-violet/10',
  statIconLive: 'size-4 text-brand-cyan',
  statIconMuted: 'size-4 text-muted-foreground',
  statPulse:
    'inline-block size-2.5 rounded-full bg-brand-lime shadow-[0_0_10px_2px_oklch(0.88_0.2_140/0.7)]',
  statTextWrap: 'relative flex min-w-0 flex-col gap-0.5',
  statValue: 'font-bold text-foreground text-2xl leading-none tabular-nums',
  statLabel: 'text-muted-foreground text-[11px] uppercase leading-none tracking-[0.12em]',
} as const;
