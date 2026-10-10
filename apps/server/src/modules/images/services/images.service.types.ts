import type { ImageSource } from '../images.types';

export type OptimizeImageInput = {
  url: string;
  width: number;
  quality: number;
};

export type RenderImageInput = {
  key: string;
  source: ImageSource;
  width: number;
  quality: number;
};

export type OptimizedImage = {
  buffer: Buffer;
  cacheControl: string;
};
