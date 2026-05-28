'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/shared/lib/cn';
import type * as React from 'react';

const Switch = ({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) => (
  <SwitchPrimitive.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-white/10 shadow-inner shadow-black/30 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-violet data-[state=checked]:border-transparent data-[state=checked]:shadow-[0_0_14px_-4px_oklch(0.7_0.2_270/0.6)] data-[state=unchecked]:bg-white/8',
      className,
    )}
    data-slot="switch"
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none ml-0.5 block size-5 rounded-full bg-white shadow-md ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      )}
      data-slot="switch-thumb"
    />
  </SwitchPrimitive.Root>
);

export { Switch };
