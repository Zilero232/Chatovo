import { cva } from 'class-variance-authority';

export const lobbyRoomCardStyles = {
  // Outer wrapper is `relative` so the manage menu can float over the card's
  // top-right corner without sitting inside the navigate button (button-in-button
  // is invalid HTML and breaks Radix focus management).
  root: 'group/card relative rounded-lg border bg-card transition-colors hover:border-primary/50 hover:bg-accent/40',

  // Only owners get the hover/focus padding shift — non-owners have no menu,
  // so reserving space leaves a confusing empty strip on the right.
  enter: cva(
    'flex w-full flex-col gap-3 rounded-lg p-4 text-left outline-none transition-[padding] focus-visible:ring-2 focus-visible:ring-primary/50',
    {
      variants: {
        owner: {
          true: 'group-focus-within/card:pr-12 group-hover/card:pr-12 group-has-[[data-state=open]]/card:pr-12',
          false: '',
        },
      },
      defaultVariants: { owner: false },
    },
  ),

  header: 'flex items-center justify-between gap-2',
  headerBadges: 'flex shrink-0 items-center gap-1.5',
  name: 'flex min-w-0 items-center gap-1.5 truncate font-semibold text-sm',
  privateIcon: 'size-3.5 shrink-0 text-muted-foreground',

  participants: 'flex items-center gap-2',
  avatars: 'flex items-center -space-x-2',
  avatar: 'size-7 ring-2 ring-card',
  avatarFallback: 'bg-primary text-[10px] text-primary-foreground',
  countLabel: 'text-muted-foreground text-xs',

  emptyHint: 'text-muted-foreground text-xs',

  menu: 'absolute top-3 right-3 opacity-0 transition-opacity group-hover/card:opacity-100 focus-within:opacity-100 data-[state=open]:opacity-100',
} as const;
