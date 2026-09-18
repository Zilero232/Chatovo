import type { Category } from '@chatovo/schemas';

export type CategoryRowProps = {
  canManage: boolean;
  category: Category;
  collapsed: boolean;
  serverId: string;
  onToggle: () => void;
};
