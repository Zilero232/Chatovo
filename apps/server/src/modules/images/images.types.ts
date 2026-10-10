export type ImageSource = { kind: 'remote'; url: string } | { kind: 'upload'; path: string };

export type ReadCachedImageInput = {
  key: string;
  maxAgeMs?: number;
};

export type WriteCachedImageInput = {
  key: string;
  buffer: Buffer;
};
