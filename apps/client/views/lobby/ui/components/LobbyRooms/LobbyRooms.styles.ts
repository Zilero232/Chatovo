export const lobbyRoomsStyles = {
  root: 'flex flex-col gap-6',

  bar: 'flex flex-wrap items-end justify-between gap-4',
  heading: 'font-semibold text-foreground text-lg tracking-tight',

  searchField:
    'group relative flex h-11 w-full items-center gap-2 rounded-xl border border-white/12 bg-white/5 pr-2 pl-3.5 shadow-[inset_0_1px_0_oklch(1_0_0/0.06)] backdrop-blur-sm transition-[border-color,box-shadow] focus-within:border-brand-cyan/45 focus-within:shadow-[0_0_0_3px_oklch(0.82_0.16_200/0.12)] sm:w-80',
  searchIcon:
    'size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-brand-cyan',
  searchInput:
    'h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0',
  searchShortcut:
    'hidden shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/6 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex',

  sections: 'flex flex-col gap-8',
  section:
    'flex animate-in flex-col gap-3.5 fill-mode-both duration-500 fade-in slide-in-from-bottom-3',
  sectionHeader: 'flex items-center gap-3',
  sectionLabel: 'shrink-0 font-semibold text-foreground/55 text-xs uppercase tracking-[0.14em]',
  sectionCount:
    'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-brand-violet/20 bg-brand-violet/10 px-1.5 font-semibold text-[10px] text-brand-violet tabular-nums',
  sectionRule: 'h-px flex-1 bg-linear-to-r from-white/12 to-transparent',

  grid: 'grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',

  skeletonCard: 'min-h-[148px] rounded-2xl',

  cardAnim: 'h-full animate-in fill-mode-both duration-400 fade-in slide-in-from-bottom-2',
  nothingFoundState: 'py-8',
} as const;
