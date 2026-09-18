import type { Category } from '@chatovo/schemas';

export type CategoryDialogProps = {
  category?: Category | null;
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
