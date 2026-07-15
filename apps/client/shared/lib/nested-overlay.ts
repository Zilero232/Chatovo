const isVisible = (element: Element) => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return element.offsetParent !== null || element.getClientRects().length > 0;
};

export const hasOpenNestedOverlay = () => {
  const overlays = document.querySelectorAll(
    [
      '[data-slot="dropdown-menu-content"]',
      '[data-slot="dropdown-menu-sub-content"]',
      '[data-slot="popover-content"]',
      '[data-slot="context-menu-content"]',
      '[data-slot="select-content"]',
      '[role="menu"]',
    ].join(','),
  );

  return [...overlays].some(isVisible);
};

export const hasNestedDialogOpen = () => {
  const dialogs = document.querySelectorAll('[data-slot="dialog-content"], [role="dialog"]');

  return [...dialogs].filter(isVisible).length > 1;
};

export const isNestedOverlayTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return false;
  }

  return (
    target.closest('[data-slot="dropdown-menu-content"]') !== null ||
    target.closest('[data-slot="dropdown-menu-sub-content"]') !== null ||
    target.closest('[data-slot="popover-content"]') !== null ||
    target.closest('[data-slot="context-menu-content"]') !== null ||
    target.closest('[data-slot="select-content"]') !== null ||
    target.closest('[role="menu"]') !== null
  );
};

export const shouldKeepDialogOpen = (target: EventTarget | null) => {
  return hasOpenNestedOverlay() || hasNestedDialogOpen() || isNestedOverlayTarget(target);
};
