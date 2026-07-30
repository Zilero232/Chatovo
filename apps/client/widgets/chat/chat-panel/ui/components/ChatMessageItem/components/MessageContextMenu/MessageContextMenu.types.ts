import type { ReactNode } from 'react';

export type MessageContextMenuProps = {
  canEdit: boolean;
  children: ReactNode;
  enabled: boolean;
  onDelete: () => void;
  onEdit: () => void;
};
