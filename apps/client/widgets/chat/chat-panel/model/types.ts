export type ChatLineStatus = 'sending' | 'failed';

export type ChatLine = {
  id: string;
  timestamp: number;
  message: string;
  editedAt?: number | null;
  deletedAt?: number | null;
  status?: ChatLineStatus;
  from?: {
    identity: string;
    name?: string;
    metadata?: string;
  };
};
