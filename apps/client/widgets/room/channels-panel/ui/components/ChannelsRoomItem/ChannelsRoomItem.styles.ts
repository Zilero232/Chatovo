import { cva } from 'class-variance-authority';

export const channelsRoomItemStyles = {
  row: 'group/room relative',
  trigger: cva(
    'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-[colors,padding] group-focus-within/room:pr-8 group-hover/room:pr-8 group-has-[[data-state=open]]/room:pr-8',
    {
      variants: {
        active: {
          true: 'bg-sidebar-accent text-sidebar-accent-foreground',
          false:
            'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
        },
      },
      defaultVariants: { active: false },
    },
  ),
  triggerLabel: 'flex items-center gap-2',
  privateIcon: 'size-3 text-muted-foreground',
  ownerIcon: 'size-3 fill-amber-300 text-amber-300',
  icon: cva('size-3.5', {
    variants: { active: { true: 'text-green-500', false: '' } },
    defaultVariants: { active: false },
  }),
  joinedIcon: 'size-3.5 text-green-500',
  count: 'flex items-center gap-1 text-muted-foreground text-xs tabular-nums',
  countDot: 'size-1.5 rounded-full bg-green-500',
  manageSlot:
    'absolute top-1/2 right-1 -translate-y-1/2 opacity-0 transition-opacity group-hover/room:opacity-100 focus-within:opacity-100 data-[state=open]:opacity-100',
  participants: 'flex flex-col',
  participant: 'flex items-center gap-2 py-1 pr-2 pl-8',
  participantAvatar: 'size-5',
  participantFallback: 'bg-primary text-[10px] text-primary-foreground',
  participantName: 'truncate text-muted-foreground text-xs',
} as const;
