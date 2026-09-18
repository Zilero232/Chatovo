import type { ReactNode } from 'react';

export type ShortcutRowProps = {
  icon: ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isHighlighted?: boolean;
  onSelect?: () => void;
};
