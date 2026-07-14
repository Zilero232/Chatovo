'use client';

import { isImageMime } from '@chatovo/schemas';
import { isTauri } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { clsx } from 'clsx';
import { FileIcon } from 'lucide-react';

import { formatBytes } from '@/shared/lib/format-bytes';

import s from './MessageAttachment.module.scss';

import type { MouseEvent } from 'react';
import type { MessageAttachmentProps } from './MessageAttachment.types';

export const MessageAttachment = ({ attachment, isOwn }: MessageAttachmentProps) => {
  const { url, name, size, mime } = attachment;

  const handleOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isTauri()) {
      return;
    }

    event.preventDefault();
    openUrl(url);
  };

  if (isImageMime(mime)) {
    return (
      <a href={url} rel="noopener noreferrer" target="_blank" onClick={handleOpen}>
        {/* biome-ignore lint/performance/noImgElement: chat attachments are arbitrary remote uploads of unknown dimensions; next/image optimization needs a known host and fixed sizes */}
        <img alt={name} className={s.image} src={url} />
      </a>
    );
  }

  return (
    <a
      className={clsx(s.fileCard, isOwn ? s.fileCardOwn : s.fileCardOther)}
      download={name}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      onClick={handleOpen}
    >
      <FileIcon className={s.fileIcon} />
      <span className={s.fileMeta}>
        <span className={s.fileName}>{name}</span>
        <span className={s.fileSize}>{formatBytes(size)}</span>
      </span>
    </a>
  );
};
