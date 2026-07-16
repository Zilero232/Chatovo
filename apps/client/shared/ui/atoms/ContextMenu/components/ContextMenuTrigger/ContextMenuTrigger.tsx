'use client';

import { useContextMenu } from '../../context-menu-context';

import type { ContextMenuTriggerProps } from '../../ContextMenu.types';

export const ContextMenuTrigger = ({
  className,
  children,
  onContextMenu,
  ...props
}: ContextMenuTriggerProps) => {
  const context = useContextMenu();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: right-click target for context menu
    <div
      ref={context?.triggerRef}
      aria-haspopup="menu"
      className={className}
      data-slot="context-menu-trigger"
      onContextMenu={(event) => {
        event.preventDefault();
        context?.setOpen(true);
        onContextMenu?.(event);
      }}
      {...props}
    >
      {children}
    </div>
  );
};
