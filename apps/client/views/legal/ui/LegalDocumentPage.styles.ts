export const legalDocumentStyles = {
  root: 'flex h-full justify-center p-4 sm:p-6',
  shell:
    'glass flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] shadow-glow-violet',
  top: 'shrink-0 border-b border-white/8 px-6 py-5 sm:px-8 sm:py-6',
  backLink:
    'mb-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-cyan transition-colors hover:text-brand-cyan/80',
  backIcon: 'size-4',
  header: 'flex flex-col gap-1.5',
  title: 'font-bold text-2xl tracking-tight gradient-text sm:text-3xl',
  updated: 'text-muted-foreground text-sm',
  scroll: 'min-h-0 flex-1 overflow-y-auto scrollbar-none px-6 py-6 sm:px-8 sm:py-8',
  sections: 'flex flex-col gap-9',
  section: 'flex flex-col gap-3',
  heading:
    'border-l-2 border-brand-violet/50 pl-3 text-base font-semibold text-foreground tracking-tight',
  body: 'flex flex-col gap-3',
  paragraph: 'text-muted-foreground text-sm leading-relaxed',
  footer: 'mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/8 pt-6 text-sm',
  footerLink:
    'text-muted-foreground underline-offset-4 transition-colors hover:text-brand-cyan hover:underline',
  footerSep: 'text-muted-foreground/40',
} as const;
