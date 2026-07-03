export const friendsDialogStyles = {
  triggerWrap: 'relative',
  triggerBadge:
    'pointer-events-none absolute -top-0.5 -right-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-brand-cyan px-1 text-[10px] font-semibold leading-none text-black',
  content: 'overflow-x-hidden',
  list: 'flex min-w-0 max-h-[min(24rem,50vh)] flex-col gap-2.5 overflow-y-auto overflow-x-hidden pr-1',
  empty:
    'rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-muted-foreground',
  action: 'w-full',
  searchRow: 'flex min-w-0 items-center gap-2',
  searchInput: 'h-9 min-w-0 flex-1',
  ownTagRow: 'flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1',
  ownTagLabel: 'shrink-0 text-xs text-muted-foreground',
  ownTagValue:
    'inline-flex max-w-full items-center truncate rounded-full border border-brand-cyan/35 bg-brand-cyan/12 px-2.5 py-1 font-mono text-xs font-semibold text-brand-cyan shadow-[0_0_0_1px_oklch(0.82_0.16_200/0.2)_inset] transition-colors hover:bg-brand-cyan/18',
  tabsList: 'grid w-full grid-cols-2',
  badge:
    'ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-cyan px-1.5 text-[10px] font-semibold text-black',
} as const;
