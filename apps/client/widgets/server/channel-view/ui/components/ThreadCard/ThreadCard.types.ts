import type { Thread, ThreadTag } from '@chatovo/schemas';

export type ThreadCardProps = {
  canManage: boolean;
  isActive: boolean;
  tagsById?: Map<string, ThreadTag>;
  thread: Thread;
  onOpen: () => void;
};
