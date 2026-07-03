export const friendListItemStyles = {
  root: 'flex min-w-0 flex-col gap-3.5 rounded-2xl border border-white/8 bg-linear-to-b from-white/6 to-white/2 p-3.5 transition-[border-color,box-shadow] duration-200 hover:border-white/14 hover:shadow-[0_10px_28px_-14px_oklch(0_0_0/0.65)]',
  profile: 'flex min-w-0 items-center gap-3',
  info: 'min-w-0 flex-1',
  name: 'truncate text-sm font-semibold tracking-tight',
  tag: 'mt-0.5 truncate font-mono text-[11px] text-muted-foreground/90',
} as const;
