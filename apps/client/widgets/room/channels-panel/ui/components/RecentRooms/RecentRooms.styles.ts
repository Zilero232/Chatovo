export const recentRoomsStyles = {
  root: 'flex flex-col gap-2 border-t border-white/8 pt-3',
  rootStrip: 'flex flex-col gap-2.5',
  heading:
    'flex items-center gap-1.5 px-2 text-muted-foreground/80 text-[10px] font-semibold uppercase tracking-[0.12em]',
  headingStrip:
    'flex items-center gap-1.5 text-muted-foreground/80 text-[10px] font-semibold uppercase tracking-[0.12em]',
  headingIcon: 'size-3 text-brand-cyan',
  list: 'flex flex-col gap-0.5',
  strip: 'flex gap-2 overflow-x-auto scrollbar-none pb-0.5',
  item: 'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/75 transition-all hover:bg-white/6 hover:text-sidebar-foreground',
  stripItem:
    'flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-shell-surface-raised px-3.5 py-2.5 text-sm text-foreground/90 shadow-[inset_0_1px_0_oklch(1_0_0/0.05)] transition-all hover:-translate-y-px hover:border-brand-violet/30 hover:bg-shell-surface hover:shadow-[0_8px_24px_-12px_oklch(0.7_0.2_270/0.5)] data-[live=true]:border-brand-cyan/30 data-[live=true]:bg-brand-cyan/6',
  dot: 'size-2 shrink-0 rounded-full bg-muted-foreground/35',
  dotLive:
    'size-2 shrink-0 rounded-full bg-brand-cyan shadow-[0_0_8px_2px_oklch(0.82_0.16_200/0.55)]',
  name: 'flex-1 truncate text-left font-medium',
  stripName: 'max-w-[11rem] truncate text-left font-medium',
  lockIcon: 'size-3 shrink-0 text-muted-foreground',
} as const;
