'use client';

import { Slider as SliderPrimitive } from 'radix-ui';
import { cn } from '@/shared/lib/cn';
import type * as React from 'react';

const Slider = ({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) => (
  <SliderPrimitive.Root
    className={cn(
      'relative flex w-full touch-none items-center select-none data-disabled:opacity-50',
      className,
    )}
    data-slot="slider"
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-2 grow overflow-hidden rounded-full bg-white/8 shadow-inner shadow-black/30"
      data-slot="slider-track"
    >
      <SliderPrimitive.Range className="absolute h-full bg-brand-violet" data-slot="slider-range" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block size-4 shrink-0 rounded-full border-2 border-white bg-brand-violet shadow-[0_0_14px_-2px_oklch(0.7_0.22_295/0.7)] transition-all outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-violet/50 disabled:pointer-events-none"
      data-slot="slider-thumb"
    />
  </SliderPrimitive.Root>
);

export { Slider };
