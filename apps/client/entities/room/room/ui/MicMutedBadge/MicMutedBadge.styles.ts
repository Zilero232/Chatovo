export const micMutedBadgeStyles = {
  // Floats above the bottom-right corner of an avatar — paired with OwnerCrown
  // on the opposite corner so the two icons never overlap.
  root: 'absolute -right-1 -bottom-1 z-10 flex size-3.5 items-center justify-center rounded-full bg-background ring-1 ring-background',
  icon: 'size-2.5 text-destructive',
} as const;
