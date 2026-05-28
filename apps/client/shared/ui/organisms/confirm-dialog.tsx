'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from '@/shared/ui/atoms';
import type { ComponentProps, ReactNode } from 'react';

type ButtonVariant = ComponentProps<typeof Button>['variant'];

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  // Optional body slot rendered between description and footer (e.g. a form).
  children?: ReactNode;
  cancelLabel: ReactNode;
  confirmLabel: ReactNode;
  // Destructive by default — matches the primary use case (delete / discard).
  confirmVariant?: ButtonVariant;
  isPending?: boolean;
  onConfirm: () => void;
};

// Standard "title + description + cancel + confirm" dialog. Replaces hand-rolled
// Dialog skeletons in features that boil down to a yes/no question.
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  cancelLabel,
  confirmLabel,
  confirmVariant = 'destructive',
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button disabled={isPending} type="button" variant={confirmVariant} onClick={onConfirm}>
            {isPending && <Spinner />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
