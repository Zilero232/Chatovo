export const messageEditorStyles = {
  root: 'flex w-full flex-col gap-1',
  input:
    'w-full resize-none overflow-hidden rounded-2xl border border-brand-cyan/40 bg-white/8 px-3.5 py-2 text-sm text-foreground outline-hidden backdrop-blur-md focus-visible:border-brand-cyan',
  hint: 'px-1 text-[11px] text-muted-foreground [@media(hover:none)]:hidden',
  actions: 'hidden justify-end gap-2 [@media(hover:none)]:flex',
} as const;
