export const lobbyRoomsStyles = {
  root: 'flex flex-col gap-5',

  bar: 'flex flex-wrap items-center justify-between gap-3',
  heading: 'font-semibold text-base text-foreground',

  searchField:
    'group relative flex h-10 w-full items-center gap-2 rounded-xl border border-white/12 bg-white/4 pr-2 pl-3.5 backdrop-blur-sm transition-colors focus-within:border-brand-cyan/50 focus-within:ring-2 focus-within:ring-brand-cyan/20 sm:w-72',
  searchIcon:
    'size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-brand-cyan',
  searchInput:
    'h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0',
  searchShortcut:
    'hidden shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex',

  sections: 'flex flex-col gap-6',
  section: 'flex flex-col gap-3',
  sectionHeader: 'flex items-center gap-3',
  sectionLabel: 'shrink-0 font-medium text-foreground/60 text-xs uppercase tracking-[0.12em]',
  sectionCount:
    'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 px-1.5 font-medium text-[10px] text-muted-foreground tabular-nums',
  sectionRule: 'h-px flex-1 bg-white/8',

  grid: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',

  skeletonCard: 'min-h-[132px] rounded-xl',

  cardAnim: 'animate-in fade-in duration-300',
  nothingFoundState: 'py-8',
} as const;
