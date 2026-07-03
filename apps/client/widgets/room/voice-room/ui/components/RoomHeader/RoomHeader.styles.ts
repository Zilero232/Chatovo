export const roomHeaderStyles = {
  root: 'surface-bar relative flex h-14 shrink-0 items-center gap-2 border-b px-4',
  accent: 'accent-top-line',
  icon: 'flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet/35 to-brand-cyan/35 text-foreground shadow-[0_0_16px_-6px_oklch(0.7_0.22_295/0.7)]',
  info: 'flex min-w-0 flex-1 flex-col leading-tight',
  titleRow: 'flex min-w-0 items-center gap-1',
  title: 'min-w-0 truncate font-semibold text-sm sm:text-base',
  mobileInvite: 'shrink-0 md:hidden',
} as const;
