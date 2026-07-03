export const friendProfileActionsStyles = {
  root: 'flex flex-col gap-3.5 rounded-2xl border border-white/8 bg-linear-to-b from-white/6 to-white/2 p-3.5',
  row: 'flex flex-wrap gap-2',
  friendsPrimary: 'grid grid-cols-2 gap-2',
  friendsAction: 'w-full',
  friendsRemove:
    'h-8 w-full gap-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
  button: 'flex-1 min-w-[7rem]',
  label: 'text-xs text-muted-foreground',
} as const;
