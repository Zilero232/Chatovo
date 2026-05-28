export const lobbyHeaderStyles = {
  // Mobile: version pill pinned top-right; title/subtitle below full-width.
  // Desktop: two columns — text left, pill right.
  root: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',

  text: 'flex min-w-0 flex-col gap-1',
  title: 'font-semibold text-xl sm:text-2xl',
  subtitle: 'text-muted-foreground text-sm',
} as const;
