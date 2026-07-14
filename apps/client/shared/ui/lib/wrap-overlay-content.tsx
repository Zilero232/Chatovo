import {
  Children,
  type ComponentProps,
  type ComponentType,
  isValidElement,
  type ReactNode,
} from 'react';
import { ModalOverlay } from 'react-aria-components';

type WrapOverlayContentParams = {
  children: ReactNode;
  contentComponent: ComponentType;
  overlayProps: ComponentProps<typeof ModalOverlay>;
  dataSlot: string;
};

export const wrapOverlayContent = ({
  children,
  contentComponent,
  overlayProps,
  dataSlot,
}: WrapOverlayContentParams) => {
  return Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== contentComponent) {
      return child;
    }

    return (
      <ModalOverlay {...overlayProps} data-slot={dataSlot}>
        {child}
      </ModalOverlay>
    );
  });
};
