import type { Thread } from '@chatovo/schemas';

export type ThreadMenuProps = {
  thread: Thread;
  canManage: boolean;
  className?: string;
};
