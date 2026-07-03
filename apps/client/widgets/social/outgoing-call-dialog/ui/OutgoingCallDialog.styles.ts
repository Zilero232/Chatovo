export const outgoingCallDialogStyles = {
  content:
    'max-w-sm gap-6 border-white/12 bg-shell-surface/95 backdrop-blur-xl shadow-[0_24px_64px_-24px_oklch(0.82_0.16_200/0.45)]',
  header: 'text-center sm:text-center',
  callee: 'flex flex-col items-center gap-3',
  avatar: 'size-20 ring-4 ring-brand-cyan/20 shadow-[0_0_40px_-8px_oklch(0.82_0.16_200/0.65)]',
  avatarFallback: 'text-2xl',
  name: 'bg-linear-to-r from-foreground to-foreground/80 bg-clip-text font-semibold text-lg text-transparent',
  cancel: 'w-full',
} as const;
