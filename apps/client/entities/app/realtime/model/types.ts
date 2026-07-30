export type RealtimeChatLine = {
  deletedAt?: number | null;
  editedAt?: number | null;
  from?: {
    identity: string;
    name?: string;
  };
  id: string;
  message: string;
  timestamp: number;
};
