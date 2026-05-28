export const channelsFooterStyles = {
  root: 'flex items-center gap-2 border-t border-white/8 bg-white/4 px-3 py-2.5',
  avatar: 'size-8',
  fallback: 'text-xs',
  info: 'flex min-w-0 flex-1 flex-col overflow-hidden',
  name: 'truncate font-semibold text-xs',
  status:
    'flex items-center gap-1 text-[10px] text-brand-cyan before:size-1.5 before:rounded-full before:bg-brand-cyan before:shadow-[0_0_6px_oklch(0.82_0.16_200/0.7)]',
} as const;
