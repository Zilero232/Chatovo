'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '@/shared/lib/cn';
import type * as React from 'react';

const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider
    data-slot="tooltip-provider"
    delayDuration={delayDuration}
    {...props}
  />
);

const Tooltip = ({ open, ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  // Touch devices have no hover — Radix tooltips fire on tap and linger, so
  // force them closed there. `useMediaQuery` is false during SSR/first paint,
  // which is the safe default (server is never a touch device).
  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)');

  return <TooltipPrimitive.Root data-slot="tooltip" open={isTouch ? false : open} {...props} />;
};

const TooltipTrigger = ({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) => (
  <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
);

const TooltipContent = ({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      className={cn(
        'glass-overlay z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-lg px-2.5 py-1.5 text-xs text-balance text-foreground fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className,
      )}
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] fill-surface-overlay" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
