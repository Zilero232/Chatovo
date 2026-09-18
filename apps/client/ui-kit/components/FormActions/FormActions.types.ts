import type { ComponentProps } from 'react';

import type { Button } from '../../primitives/Button';

export type FormActionsProps = {
  submitLabel: string;
  cancelLabel?: string;
  isDisabled?: boolean;
  isPending?: boolean;
  submitVariant?: ComponentProps<typeof Button>['variant'];
  onCancel?: () => void;
};
