export type CreateThreadDialogProps = {
  channelId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (threadId: string) => void;
};
