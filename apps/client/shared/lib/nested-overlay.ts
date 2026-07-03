const NESTED_OVERLAY_SELECTOR = [
  '[data-slot="dropdown-menu-content"][data-state="open"]',
  '[data-slot="dropdown-menu-sub-content"][data-state="open"]',
  '[data-slot="popover-content"][data-state="open"]',
  '[data-slot="select-content"][data-state="open"]',
].join(', ');

const NESTED_OVERLAY_TARGET_SELECTOR = [
  '[data-slot="dropdown-menu-content"]',
  '[data-slot="dropdown-menu-sub-content"]',
  '[data-slot="popover-content"]',
  '[data-slot="select-content"]',
].join(', ');

export const hasOpenNestedOverlay = () => {
  return document.querySelector(NESTED_OVERLAY_SELECTOR) !== null;
};

export const hasNestedDialogOpen = () => {
  return document.querySelectorAll('[data-slot="dialog-content"][data-state="open"]').length > 1;
};

export const isNestedOverlayTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.closest(NESTED_OVERLAY_TARGET_SELECTOR) !== null;
};

export const shouldKeepDialogOpen = (target: EventTarget | null) => {
  return hasOpenNestedOverlay() || hasNestedDialogOpen() || isNestedOverlayTarget(target);
};
