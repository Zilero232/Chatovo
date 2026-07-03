import { cva } from 'class-variance-authority';

export const lobbyRoomCardStyles = {
  root: 'group/card glass glass-hover relative flex h-full min-h-[148px] flex-col overflow-hidden rounded-2xl border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_oklch(0.7_0.2_270/0.55)] data-[live=true]:border-brand-cyan/35 data-[live=true]:shadow-[0_0_0_1px_oklch(0.82_0.16_200/0.2),0_12px_36px_-16px_oklch(0.82_0.16_200/0.45)]',

  liveGlow:
    'pointer-events-none absolute -right-8 -bottom-10 size-32 rounded-full bg-brand-cyan/20 blur-2xl transition-opacity group-hover/card:opacity-100',
  liveAccent:
    'pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-brand-cyan/0 via-brand-cyan/80 to-brand-violet/0 opacity-0 transition-opacity group-hover/card:opacity-100 data-[live=true]:opacity-100',
  watermark:
    'pointer-events-none absolute right-3 bottom-2 size-16 text-brand-violet/8 transition-transform duration-300 group-hover/card:scale-110 group-hover/card:text-brand-violet/12',

  enter: cva(
    'relative flex h-full w-full flex-col gap-3 rounded-2xl p-4 pr-11 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40',
  ),

  header: 'flex items-start justify-between gap-2',
  headerBadges: 'flex shrink-0 items-center gap-1.5',
  name: 'flex min-w-0 items-center gap-1.5 truncate font-semibold text-[15px] transition-colors group-hover/card:text-foreground',
  privateIcon: 'size-3.5 shrink-0 text-muted-foreground',

  body: 'mt-auto flex min-h-[1.75rem] items-center gap-2',

  participants: 'flex items-center gap-2.5',
  avatars: 'flex items-center -space-x-2.5',
  avatar: 'size-8 ring-2 ring-background/70',
  avatarFallback: 'text-[10px]',
  countLabel: 'text-muted-foreground text-xs',

  emptySlots: 'flex w-full items-center justify-between gap-2',
  emptyAvatars: 'flex items-center -space-x-2',
  emptySlot:
    'size-8 rounded-full border border-white/14 border-dashed bg-linear-to-br from-white/6 to-white/2 transition-all group-hover/card:border-brand-violet/30 group-hover/card:bg-brand-violet/8',
  emptyJoin:
    'rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors group-hover/card:border-brand-cyan/25 group-hover/card:bg-brand-cyan/10 group-hover/card:text-brand-cyan',

  menu: 'absolute top-2.5 right-2.5 opacity-0 transition-opacity group-hover/card:opacity-100 focus-within:opacity-100 data-[state=open]:opacity-100',
} as const;
