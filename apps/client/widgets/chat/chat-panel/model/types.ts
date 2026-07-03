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
