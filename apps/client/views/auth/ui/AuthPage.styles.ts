export const authPageStyles = {
  root: 'flex h-full items-center justify-center p-4',
  card: 'glass w-full max-w-md rounded-3xl p-7 shadow-glow-violet sm:p-9',
  header: 'mb-6 flex flex-col gap-1.5',
  title: 'font-bold text-3xl tracking-tight text-foreground',
  subtitle: 'text-muted-foreground text-sm',
  toggle: 'mt-5 text-center text-muted-foreground text-sm',
  toggleButton: 'font-semibold text-brand-cyan hover:underline',
  divider: 'my-5 flex items-center gap-3',
  dividerLine: 'h-px flex-1 bg-linear-to-r from-transparent via-white/15 to-transparent',
  dividerText: 'text-muted-foreground text-xs uppercase tracking-[0.14em]',
} as const;
