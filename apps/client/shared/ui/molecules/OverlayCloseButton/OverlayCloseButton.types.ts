import type { ComponentProps } from 'react';

export type OverlayCloseButtonProps = {
  className?: string;
  onPress: () => void;
} & Pick<ComponentProps<'button'>, 'slot'>;
