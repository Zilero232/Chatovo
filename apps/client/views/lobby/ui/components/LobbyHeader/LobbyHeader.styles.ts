export const lobbyHeaderStyles = {
  // Mobile: clock pinned top-right as compact chip, title/subtitle below full-width.
  // Desktop: two columns — text left, big clock right.
  root: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',

  text: 'flex min-w-0 flex-col gap-1',
  title: 'font-semibold text-xl sm:text-2xl',
  subtitle: 'text-muted-foreground text-sm',

  // Clock — chip on mobile (top), stacked column on desktop (right).
  clock:
    'order-first flex items-baseline gap-2 self-end rounded-full border bg-card/60 px-3 py-1 leading-tight sm:order-none sm:flex-col sm:items-end sm:gap-0 sm:self-auto sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0',
  time: 'font-semibold text-sm tabular-nums sm:text-2xl',
  date: 'text-muted-foreground text-xs',
} as const;
