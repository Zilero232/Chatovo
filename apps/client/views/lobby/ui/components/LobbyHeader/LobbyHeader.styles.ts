export const lobbyHeaderStyles = {
  root: 'relative isolate overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-brand-violet/20 via-white/4 to-brand-cyan/18 p-6 shadow-[0_1px_0_oklch(1_0_0/0.06)_inset] sm:p-10',

  grid: 'pointer-events-none absolute inset-0 [background-image:linear-gradient(oklch(1_0_0/0.025)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.025)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black,transparent)]',
  glow: 'pointer-events-none absolute -top-32 -right-24 size-72 rounded-full bg-brand-violet/35 blur-[100px]',
  glowAlt:
    'pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-brand-cyan/30 blur-[100px]',

  inner: 'relative flex flex-col gap-6 sm:gap-8',

  topRow: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6',
  identity: 'flex min-w-0 items-center gap-3.5 sm:gap-4',
  avatarWrap:
    'relative shrink-0 rounded-full bg-linear-to-br from-brand-cyan/60 to-brand-violet/60 p-0.5 shadow-[0_0_24px_-4px_oklch(0.7_0.2_270/0.5)]',
  avatar: 'size-12 ring-2 ring-background/40 sm:size-14',
  avatarFallback: 'gradient-brand font-semibold text-base text-white sm:text-lg',
  text: 'flex min-w-0 flex-col gap-1.5',
  title: 'truncate font-bold text-2xl text-foreground tracking-tight sm:text-3xl',
  subtitle: 'text-muted-foreground text-sm sm:text-base',

  versionPill:
    'group relative inline-flex shrink-0 items-center gap-2 self-start overflow-hidden rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 backdrop-blur-md transition-all hover:border-brand-cyan/45 hover:bg-white/8 hover:shadow-[0_0_0_3px_oklch(0.82_0.16_200/0.08)] sm:self-auto',
  versionIcon:
    'size-3.5 text-brand-cyan drop-shadow-[0_0_8px_oklch(0.82_0.16_200/0.8)] transition-transform group-hover:rotate-12',
  versionText:
    'bg-linear-to-r from-brand-cyan to-brand-violet bg-clip-text font-semibold text-transparent text-xs tabular-nums tracking-[0.04em]',

  stats: 'grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3',
  stat: 'group/stat flex animate-in items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 fill-mode-both backdrop-blur-md fade-in transition-colors slide-in-from-bottom-2 duration-500 hover:border-white/15 hover:bg-white/6',
  statIconWrap:
    'flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5',
  statIcon: 'size-4 text-brand-cyan',
  statIconLive: 'size-4 text-brand-cyan drop-shadow-[0_0_6px_oklch(0.82_0.16_200/0.7)]',
  statIconMuted: 'size-4 text-muted-foreground',
  statPulse:
    'inline-block size-2 animate-pulse rounded-full bg-brand-violet shadow-[0_0_10px_oklch(0.7_0.2_270/0.8)]',
  statTextWrap: 'flex min-w-0 flex-col gap-0.5',
  statValue: 'font-bold text-foreground text-xl leading-none tabular-nums',
  statLabel: 'text-muted-foreground text-xs uppercase leading-none tracking-[0.12em]',
} as const;
