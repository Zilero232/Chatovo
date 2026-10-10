export type SafeFetchInput = {
  url: string;
  accept: string;
  maxBytes: number;
  truncate?: boolean;
};

export type SafeFetchResult = {
  url: string;
  contentType: string;
  body: Buffer;
};

export type RequestPinnedInput = {
  url: URL;
  accept: string;
  signal: AbortSignal;
};

export type ReadBodyInput = {
  response: Response;
  maxBytes: number;
  truncate: boolean;
};
