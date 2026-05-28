export const lobbyHeaderStyles = {
  // Mobile: version pill pinned top-right; title/subtitle below full-width.
  // Desktop: two columns — text left, pill right.
  root: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',

  text: 'flex min-w-0 flex-col gap-1',
  title: 'font-semibold text-xl sm:text-2xl',
  subtitle: 'text-muted-foreground text-sm',

  versionPill:
    'order-first inline-flex items-center gap-1.5 self-end rounded-full border border-border/60 bg-gradient-to-r from-primary/10 via-card to-card px-3 py-1 text-xs leading-tight shadow-sm transition-colors hover:border-primary/40 sm:order-none sm:self-auto',
  versionIcon: 'size-3.5 text-primary',
  versionLabel: 'font-medium tabular-nums tracking-wide text-foreground/90',
} as const;
