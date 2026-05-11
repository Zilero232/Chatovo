export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number; mime: string };

export type RawMessage = {
  message: string;
  timestamp: number;
  from?: { identity?: string };
};

export type MessageGroup = {
  sender: string;
  first: number;
  messages: RawMessage[];
};
