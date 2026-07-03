export const roomHeaderStyles = {
  root: 'flex items-center gap-2 border-b border-white/8 bg-linear-to-b from-white/4 to-transparent px-2 py-2 sm:px-4 sm:py-3.5',
  icon: 'flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet/30 to-brand-cyan/30 text-foreground shadow-[0_4px_16px_-4px_oklch(0.7_0.22_295/0.5)] sm:size-9',
  info: 'flex min-w-0 flex-1 flex-col leading-tight',
  titleRow: 'flex min-w-0 items-center gap-1',
  title: 'min-w-0 truncate font-semibold text-sm sm:text-base',
  mobileInvite: 'shrink-0 md:hidden',
} as const;
