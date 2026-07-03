export const editMessageDialogStyles = {
  root: 'flex flex-col gap-1.5',
  input:
    'max-h-[40vh] w-full resize-none scrollbar-thin overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-[15px] text-foreground leading-relaxed outline-hidden backdrop-blur-md transition-colors focus-visible:border-brand-cyan/60 focus-visible:bg-white/8 focus-visible:ring-2 focus-visible:ring-brand-cyan/25',
  hint: 'px-1 text-[11px] text-muted-foreground',
} as const;
