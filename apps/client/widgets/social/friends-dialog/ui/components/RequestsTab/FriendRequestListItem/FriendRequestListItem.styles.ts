export const friendRequestListItemStyles = {
  root: 'flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.06]',
  info: 'min-w-0 flex-1',
  name: 'truncate text-sm font-medium leading-tight',
  tag: 'mt-0.5 truncate text-xs leading-tight text-muted-foreground',
  actions: 'flex shrink-0 items-center gap-1.5',
  action: 'h-8 px-2.5',
} as const;
