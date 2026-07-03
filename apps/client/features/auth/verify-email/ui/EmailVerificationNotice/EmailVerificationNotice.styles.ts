export const emailVerificationNoticeStyles = {
  root: 'flex flex-col gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4',
  header: 'flex items-start gap-3',
  icon: 'mt-0.5 size-4 shrink-0 text-amber-400',
  copy: 'flex min-w-0 flex-col gap-1',
  title: 'font-medium text-sm text-foreground',
  description: 'text-muted-foreground text-xs leading-relaxed',
  actions: 'flex flex-wrap items-center gap-2',
  sent: 'text-muted-foreground text-xs',
} as const;
