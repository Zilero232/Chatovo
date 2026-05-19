export const cardVideoStyles = {
  pane: 'group/pane relative min-w-0 cursor-pointer overflow-hidden bg-black',
  video: 'h-full w-full object-contain',

  fullscreenHint:
    'absolute top-2 right-2 rounded bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover/pane:opacity-100',
  hintIcon: 'size-4',
} as const;
