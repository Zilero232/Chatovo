export const roomHeaderStyles = {
  root: 'flex h-14 shrink-0 items-center gap-2 border-b border-white/8 bg-white/2 px-4 backdrop-blur-sm',
  icon: 'flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-violet/30 to-brand-cyan/30 text-foreground',
  info: 'flex min-w-0 flex-1 flex-col leading-tight',
  titleRow: 'flex min-w-0 items-center gap-1',
  title: 'min-w-0 truncate font-semibold text-sm sm:text-base',
  mobileInvite: 'shrink-0 md:hidden',
} as const;
