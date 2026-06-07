export type ChatLine = {
  id: string;
  timestamp: number;
  message: string;
  editedAt?: number | null;
  deletedAt?: number | null;
  from?: {
    identity: string;
    name?: string;
    metadata?: string;
  };
};

export type ChatSyncEvent =
  | { kind: 'edit'; id: string; body: string; editedAt: number }
  | { kind: 'delete'; id: string; deletedAt: number };
