const NESTED_OVERLAY_SELECTORS = [
  '[data-slot="dropdown-menu-content"]',
  '[data-slot="dropdown-menu-sub-content"]',
  '[data-slot="popover-content"]',
  '[data-slot="context-menu-content"]',
  '[data-slot="select-content"]',
  '[role="menu"]'
];

const isOpen = (element: Element) =>
  element.hasAttribute('data-open') && !element.hasAttribute('data-closed');

const isVisible = (element: Element) => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return element.offsetParent !== null || element.getClientRects().length > 0;
};

export const hasOpenNestedOverlay = () =>
  [...document.querySelectorAll(NESTED_OVERLAY_SELECTORS.join(','))].some(isOpen);

export const hasNestedDialogOpen = () => {
  const dialogs = document.querySelectorAll('[data-slot="dialog-content"], [role="dialog"]');

  return [...dialogs].filter(isVisible).length > 1;
};

export const isNestedOverlayTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return false;
  }

  return NESTED_OVERLAY_SELECTORS.some((selector) => target.closest(selector) !== null);
};

export const shouldKeepDialogOpen = (target: EventTarget | null) =>
  hasOpenNestedOverlay() || hasNestedDialogOpen() || isNestedOverlayTarget(target);
