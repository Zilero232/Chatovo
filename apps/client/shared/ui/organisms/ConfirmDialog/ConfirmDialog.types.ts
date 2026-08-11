import type { ComponentProps, ReactNode } from 'react';

import type { Button } from '../../atoms/Button';
import type { DialogHeaderTone } from '../../atoms/Dialog';

export type ConfirmDialogProps = {
  cancelLabel: ReactNode;
  children?: ReactNode;
  confirmLabel: ReactNode;
  confirmVariant?: ComponentProps<typeof Button>['variant'];
  description?: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  isPending?: boolean;
  open: boolean;
  title: ReactNode;
  tone?: DialogHeaderTone;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};
