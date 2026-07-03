export const lobbyHeaderStyles = {
  root: 'relative overflow-hidden rounded-2xl border border-white/10 glass p-5 sm:p-8',

  accent:
    'pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-brand-violet/0 via-brand-cyan/60 to-brand-violet/0',
  wash: 'pointer-events-none absolute -top-24 right-0 size-56 rounded-full bg-brand-violet/15 blur-3xl',
  washAlt:
    'pointer-events-none absolute -bottom-20 left-0 size-48 rounded-full bg-brand-cyan/12 blur-3xl',

  inner: 'relative flex flex-col gap-6',

  topRow: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6',
  identity: 'flex min-w-0 items-center gap-3.5 sm:gap-4',
  avatarWrap:
    'relative shrink-0 rounded-full bg-linear-to-br from-brand-violet/50 to-brand-cyan/50 p-px',
  avatar: 'size-12 ring-2 ring-background/50 sm:size-14',
  avatarFallback: 'gradient-brand font-semibold text-base text-white sm:text-lg',
  text: 'flex min-w-0 flex-col gap-1',
  title: 'truncate font-bold text-2xl text-foreground tracking-tight sm:text-[1.75rem]',
  subtitle: 'text-muted-foreground text-sm',

  versionPill:
    'inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/12 bg-white/6 px-3 py-1.5 backdrop-blur-sm sm:self-auto',
  versionIcon: 'size-3.5 text-brand-cyan',
  versionText: 'font-medium text-foreground/85 text-xs tabular-nums',

  stats: 'grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3',
  stat: 'surface-card flex items-center gap-3 rounded-xl px-4 py-3.5',
  statIconWrap:
    'flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/4',
  statIcon: 'size-4 text-brand-cyan',
  statIconLive: 'size-4 text-brand-cyan',
  statIconMuted: 'size-4 text-muted-foreground',
  statPulse: 'inline-block size-2 rounded-full bg-brand-cyan',
  statTextWrap: 'flex min-w-0 flex-col gap-0.5',
  statValue: 'font-bold text-foreground text-xl leading-none tabular-nums',
  statLabel: 'text-muted-foreground text-[11px] uppercase leading-none tracking-[0.1em]',
} as const;
