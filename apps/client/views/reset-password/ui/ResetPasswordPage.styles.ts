export const resetPasswordPageStyles = {
  root: 'relative flex h-full items-center justify-center overflow-hidden inset-page-x inset-page-y',

  shell: 'relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] glass shadow-glow-violet',

  panel: 'relative flex flex-col justify-center p-7 sm:p-9',
  mark: 'mb-5 flex size-12 items-center justify-center self-start rounded-2xl gradient-brand text-background shadow-glow-cyan',
  header: 'mb-6 flex flex-col gap-1.5',
  title: 'font-bold text-3xl tracking-tight gradient-text',
  subtitle: 'text-muted-foreground text-sm',

  form: 'animate-in fade-in duration-300 flex flex-col gap-4',

  actions: 'flex flex-col gap-3 animate-in fade-in duration-300',

  openInAppLink:
    'mt-2 text-center font-semibold text-brand-cyan transition-colors hover:text-brand-cyan/80 hover:underline',

  backButton:
    'font-semibold text-brand-cyan transition-colors hover:text-brand-cyan/80 hover:underline',
} as const;
