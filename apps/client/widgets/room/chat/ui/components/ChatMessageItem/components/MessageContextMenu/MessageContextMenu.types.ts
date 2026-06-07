import type { ReactNode } from 'react';

export type MessageContextMenuProps = {
  children: ReactNode;
  enabled: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
};
