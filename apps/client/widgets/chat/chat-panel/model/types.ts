export type ChatLineStatus = 'failed' | 'sending';

export type ChatLine = {
  deletedAt?: number | null;
  editedAt?: number | null;
  from?: {
    identity: string;
    name?: string;
    metadata?: string;
  };
  id: string;
  message: string;
  status?: ChatLineStatus;
  timestamp: number;
};
