import type { ReactNode } from 'react';

export type FriendsDialogTriggerRenderProps = {
  onOpen: () => void;
};

export type FriendsDialogProps = {
  renderTrigger?: (props: FriendsDialogTriggerRenderProps) => ReactNode;
};
