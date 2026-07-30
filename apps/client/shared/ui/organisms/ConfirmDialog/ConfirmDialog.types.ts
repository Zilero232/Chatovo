import type { ComponentProps, ReactNode } from 'react';

import type { Button } from '../../atoms/Button';

export type ConfirmDialogProps = {
  cancelLabel: ReactNode;
  children?: ReactNode;
  confirmLabel: ReactNode;
  confirmVariant?: ComponentProps<typeof Button>['variant'];
  description?: ReactNode;
  isPending?: boolean;
  open: boolean;
  title: ReactNode;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};
