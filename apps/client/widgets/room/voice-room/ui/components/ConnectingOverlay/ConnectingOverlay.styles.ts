export const connectingOverlayStyles = {
  root: 'absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-md',
  box: 'glass flex flex-col items-center gap-3 rounded-2xl px-8 py-6 shadow-glow-violet',
  icon: 'size-6 animate-spin text-brand-violet drop-shadow-[0_0_8px_oklch(0.7_0.2_270/0.6)]',
  text: 'text-foreground/85 text-sm',
} as const;
