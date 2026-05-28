export const ownerCrownStyles = {
  // Floats above the bottom-left edge of an avatar — matches the "verified"
  // badge anchoring on the right so the two never collide.
  root: 'absolute -top-1 -left-1 z-10 flex size-3.5 items-center justify-center rounded-full bg-background ring-1 ring-background',
  icon: 'size-2.5 fill-amber-300 text-amber-300',
} as const;
