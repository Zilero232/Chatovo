export const mobileNavStyles = {
  topBar: 'glass flex h-14 shrink-0 items-center gap-3 rounded-2xl px-3 md:hidden',
  menuButton: 'shrink-0',
  brand: 'flex min-w-0 flex-1 items-center gap-2',
  brandIcon:
    'flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand-violet/30 to-brand-cyan/30 text-foreground',
  brandTitle: 'truncate font-semibold text-base leading-none tracking-tight',

  sheet: 'flex w-[min(22rem,90vw)] flex-col gap-0 p-0',
  sheetTitleSr: 'sr-only',
  sheetBody: 'flex min-h-0 flex-1 flex-col',
  sheetActions: 'border-b border-white/8',
  sheetChannels: 'flex min-h-0 flex-1',
} as const;
