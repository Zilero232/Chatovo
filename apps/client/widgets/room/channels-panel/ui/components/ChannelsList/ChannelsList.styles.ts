export const channelsListStyles = {
  scroll: 'flex-1',
  list: 'flex flex-col gap-0.5 p-2',
  sectionLabel:
    'px-2 py-1 text-muted-foreground/80 text-[10px] uppercase tracking-[0.12em] font-semibold',
  sectionLabelOffset: 'mt-3',
  loaderIcon: 'mx-auto my-2 size-4 animate-spin text-muted-foreground',
  emptyHint: 'px-2 py-1 text-muted-foreground text-xs italic',
  search: 'px-2 pt-2',
  searchField:
    'group flex h-9 w-full items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-2.5 shadow-inner shadow-black/20 backdrop-blur-md transition-all hover:border-white/20 focus-within:border-brand-cyan/60 focus-within:bg-white/8 focus-within:ring-2 focus-within:ring-brand-cyan/25',
  searchIcon:
    'size-3.5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-brand-cyan',
  searchInput:
    'h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0',
} as const;
