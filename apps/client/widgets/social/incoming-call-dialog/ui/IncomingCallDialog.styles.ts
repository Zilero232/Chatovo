export const incomingCallDialogStyles = {
  content:
    'max-w-sm gap-6 border-white/12 bg-shell-surface/95 backdrop-blur-xl shadow-[0_24px_64px_-24px_oklch(0.7_0.22_295/0.55)]',
  header: 'text-center sm:text-center',
  caller: 'flex flex-col items-center gap-3',
  avatar:
    'size-20 ring-4 ring-brand-violet/20 shadow-[0_0_40px_-8px_oklch(0.7_0.22_295/0.75)] animate-pulse',
  avatarFallback: 'text-2xl',
  name: 'bg-linear-to-r from-foreground to-foreground/80 bg-clip-text font-semibold text-lg text-transparent',
  actions: 'grid grid-cols-2 gap-2',
} as const;
