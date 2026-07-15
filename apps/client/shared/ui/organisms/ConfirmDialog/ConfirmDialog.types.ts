import type { ComponentProps, ReactNode } from 'react';
import type { Button } from '../../atoms/Button';

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  cancelLabel: ReactNode;
  confirmLabel: ReactNode;
  confirmVariant?: ComponentProps<typeof Button>['variant'];
  isPending?: boolean;
  onConfirm: () => void;
};
