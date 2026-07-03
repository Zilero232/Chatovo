export const chatComposerStyles = {
  root: 'flex items-end gap-2 border-t border-white/8 bg-white/2 p-2.5',
  input:
    'min-h-9 max-h-32 flex-1 resize-none scrollbar-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground shadow-inner shadow-black/20 outline-none backdrop-blur-md transition-all placeholder:text-muted-foreground hover:border-white/20 focus-visible:border-brand-violet/60 focus-visible:bg-white/8 focus-visible:ring-2 focus-visible:ring-brand-violet/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  sendActive:
    'border-brand-violet/50 bg-brand-violet/20 text-brand-violet shadow-[0_0_16px_-4px_oklch(0.7_0.22_295/0.7)] hover:bg-brand-violet/30',
  sendIconActive: 'text-brand-violet',
} as const;
