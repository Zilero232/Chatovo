import type { ThreadTag } from '@chatovo/schemas';

export type ThreadTagChipProps = {
  tag: ThreadTag;
  isActive?: boolean;
  onToggle?: (tagId: string) => void;
};
