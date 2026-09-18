import type { Category } from '@chatovo/schemas';

export type DeleteCategoryDialogProps = {
  category: Category;
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
