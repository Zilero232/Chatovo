'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { AttachmentImageProps } from './AttachmentImage.types';

import { CHAT_IMAGE_FALLBACK_SIZE } from '../../../../../config';
import { ImageLightbox } from '../ImageLightbox/ImageLightbox';

import s from './AttachmentImage.module.scss';

export const AttachmentImage = ({ attachment }: AttachmentImageProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { url, name, size, image } = attachment;
  const { width, height } = image ?? CHAT_IMAGE_FALLBACK_SIZE;
  const isProcessed = Boolean(image);

  return (
    <>
      <button className={s.button} type='button' onClick={() => setIsPreviewOpen(true)}>
        <Image
          alt={name}
          blurDataURL={image?.placeholder}
          className={s.image}
          height={height}
          placeholder={image ? 'blur' : 'empty'}
          sizes='(max-width: 40rem) 85vw, 32rem'
          src={url}
          unoptimized={!isProcessed}
          width={width}
        />
      </button>

      <ImageLightbox
        height={height}
        name={name}
        open={isPreviewOpen}
        size={size}
        src={url}
        unoptimized={!isProcessed}
        width={width}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
};
