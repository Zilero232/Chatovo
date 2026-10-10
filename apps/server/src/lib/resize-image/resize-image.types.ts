export type ResizeImageInput = {
  buffer: Buffer;
  width: number;
  quality: number;
};

export type ResizedImage = {
  buffer: Buffer;
  width: number;
  height: number;
};
