export const friendListItemStyles = {
  root: 'group flex min-w-0 items-center rounded-xl transition-colors hover:bg-white/[0.06] focus-within:bg-white/[0.06]',
  main: 'flex min-w-0 flex-1 items-center gap-3 rounded-xl py-2.5 pl-3 pr-1.5 text-left outline-hidden transition-colors active:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-inset',
  avatar: 'shrink-0',
  info: 'min-w-0 flex-1',
  name: 'truncate text-sm font-medium leading-tight',
  tag: 'mt-0.5 truncate text-xs leading-tight text-muted-foreground',
  unread:
    'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-cyan px-1.5 text-[10px] font-semibold leading-none text-black',
  chevron:
    'size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground/80',
  menuTrigger:
    'mr-1.5 size-8 shrink-0 text-muted-foreground opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100',
  menuItemDestructive: 'text-destructive focus:text-destructive',
} as const;
