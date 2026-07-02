export const downloadAppDialogStyles = {
  content: 'gap-5 sm:max-w-2xl',
  description: 'text-muted-foreground text-sm leading-relaxed',
  section: 'flex flex-col gap-2.5',
  sectionTitle: 'font-medium text-muted-foreground text-xs uppercase tracking-wider',
  desktopGrid: 'grid grid-cols-1 gap-3 min-[480px]:grid-cols-3',
  mobileGrid: 'grid grid-cols-1 gap-3 min-[480px]:max-w-[11rem]',
  fallback:
    'rounded-lg border border-white/10 bg-white/5 p-4 text-center text-muted-foreground text-sm backdrop-blur-md',
  fallbackLink: 'font-medium text-brand-cyan underline-offset-4 hover:underline',
  meta: 'flex items-center justify-between border-white/10 border-t pt-4 text-muted-foreground text-xs',
  metaLink: 'inline-flex items-center gap-1 hover:text-foreground',
  metaLinkIcon: 'size-3',
  spinner: 'mx-auto size-6 animate-spin text-muted-foreground',
} as const;
