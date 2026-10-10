export type ProcessChatImageInput = {
  buffer: Buffer;
  mime: string;
};

export type ImageDimensions = {
  width: number;
  height: number;
};

export type ProcessedChatImage = ImageDimensions & {
  original: ProcessChatImageInput;
  placeholder: string;
};
