export const friendListActionsStyles = {
  root: 'flex flex-col gap-2',
  primary: 'grid grid-cols-2 gap-2',
  messageWrap: 'relative',
  action: 'w-full',
  messageBadge:
    'pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-white/10 bg-brand-violet px-1 text-[10px] font-semibold text-white shadow-[0_0_10px_-2px_oklch(0.7_0.22_295/0.8)]',
  messageBadgePulse: 'animate-pulse',
  remove:
    'h-8 w-full gap-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
} as const;
