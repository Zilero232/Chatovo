export const chatConversationStyles = {
  root: 'relative flex min-h-0 flex-1 flex-col',
  scroll: 'min-h-0 flex-1 overflow-y-auto',
  list: 'flex flex-col gap-3 p-3',
  dropOverlay:
    'pointer-events-none absolute inset-0 z-50 m-3 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-brand-violet border-dashed bg-background/80 text-sm font-medium text-foreground backdrop-blur-sm',
} as const;
