export const mobileNavStyles = {
  topBar:
    'flex h-14 shrink-0 items-center gap-3 border-b bg-sidebar/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 md:hidden',
  menuButton: 'shrink-0',
  brand: 'flex min-w-0 flex-1 items-center gap-2',
  brandIcon:
    'flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary',
  brandTitle: 'truncate font-semibold text-base leading-none',

  sheet: 'flex w-[min(20rem,88vw)] flex-col gap-0 p-0',
  sheetTitleSr: 'sr-only',
  sheetBody: 'flex min-h-0 flex-1 flex-col',
  sheetActions: 'border-b',
  sheetChannels: 'flex min-h-0 flex-1',
} as const;
