export const recentRoomsStyles = {
  root: 'flex flex-col gap-2 border-t border-white/8 pt-3',
  rootStrip: 'flex flex-col gap-2',
  heading:
    'flex items-center gap-1.5 px-2 text-muted-foreground/80 text-[10px] font-semibold uppercase tracking-[0.12em]',
  headingStrip:
    'flex items-center gap-1.5 text-muted-foreground/80 text-[10px] font-semibold uppercase tracking-[0.12em]',
  headingIcon: 'size-3 text-brand-cyan',
  list: 'flex flex-col gap-0.5',
  strip: 'flex gap-2 overflow-x-auto scrollbar-none pb-0.5',
  item: 'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/75 transition-all hover:bg-white/6 hover:text-sidebar-foreground',
  stripItem:
    'flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-shell-surface-raised px-3 py-2 text-sm text-foreground/85 transition-colors hover:border-brand-violet/25 hover:bg-shell-surface',
  dot: 'size-1.5 shrink-0 rounded-full bg-muted-foreground/40',
  dotLive: 'size-1.5 shrink-0 animate-pulse rounded-full bg-brand-cyan',
  name: 'flex-1 truncate text-left',
  stripName: 'max-w-[10rem] truncate text-left',
  lockIcon: 'size-3 shrink-0 text-muted-foreground',
} as const;
