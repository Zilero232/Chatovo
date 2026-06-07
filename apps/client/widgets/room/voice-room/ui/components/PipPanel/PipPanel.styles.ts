import type { CSSProperties } from 'react';

export const pipPanelStyles = {
  root: 'flex h-screen w-screen flex-col gap-2 bg-background p-2 text-foreground',
  grid: 'min-h-0 flex-1 overflow-y-auto',
  controls: 'flex shrink-0 items-center justify-center gap-2',
  button:
    'inline-flex size-9 items-center justify-center rounded-full bg-white/8 text-foreground transition-colors hover:bg-white/14 data-[tone=danger]:bg-destructive/20 data-[tone=danger]:text-destructive data-[tone=leave]:bg-destructive data-[tone=leave]:text-white [&>svg]:size-4',
} as const;

export const roomPipStyles = {
  trigger: 'size-9! shrink-0 sm:size-10! [@media(hover:none)]:hidden',
} as const;

export const pipGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gridAutoRows: 'min-content',
  alignContent: 'start',
  gap: '6px',
};
