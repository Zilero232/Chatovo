export const lobbyHeaderStyles = {
  // Mobile: version pill pinned top-right; title/subtitle below full-width.
  // Desktop: two columns — text left, pill right.
  root: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',

  text: 'flex min-w-0 flex-col gap-2',
  title: 'font-bold text-2xl text-foreground sm:text-3xl tracking-tight',
  subtitle: 'text-muted-foreground text-sm sm:text-base',

  versionPill:
    'group relative inline-flex shrink-0 items-center gap-2 self-start overflow-hidden rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 backdrop-blur-md transition-all hover:border-brand-cyan/45 hover:bg-white/8 hover:shadow-[0_0_0_3px_oklch(0.82_0.16_200/0.08)] sm:self-auto',
  versionIcon:
    'size-3.5 text-brand-cyan drop-shadow-[0_0_8px_oklch(0.82_0.16_200/0.8)] transition-transform group-hover:rotate-12',
  versionText:
    'bg-linear-to-r from-brand-cyan to-brand-violet bg-clip-text font-semibold text-transparent text-xs tabular-nums tracking-[0.04em]',
} as const;
