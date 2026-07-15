export type RemoveFriendConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  friendName: string;
};
