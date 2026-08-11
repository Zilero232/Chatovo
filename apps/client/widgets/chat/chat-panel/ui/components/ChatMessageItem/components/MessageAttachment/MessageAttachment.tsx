'use client';

import type { MouseEvent } from 'react';

import { isImageMime } from '@chatovo/schemas';
import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';
import { FileIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';

import { openExternal } from '@/shared/lib';

import type { MessageAttachmentProps } from './MessageAttachment.types';

import { useChatMessage } from '../../../../../model/contexts';

import s from './MessageAttachment.module.scss';

export const MessageAttachment = ({ attachment }: MessageAttachmentProps) => {
  const { isOwn } = useChatMessage();
  const { url, name, size, mime } = attachment;

  const handleOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isTauri()) {
      return;
    }

    event.preventDefault();
    openExternal(url);
  };

  if (isImageMime(mime)) {
    return (
      <a href={url} rel='noopener noreferrer' target='_blank' onClick={handleOpen}>
        <img alt={name} className={s.image} src={url} />
      </a>
    );
  }

  return (
    <a
      className={clsx(s.fileCard, { [s.fileCardOwn]: isOwn, [s.fileCardOther]: !isOwn })}
      download={name}
      href={url}
      rel='noopener noreferrer'
      target='_blank'
      onClick={handleOpen}
    >
      <FileIcon className={s.fileIcon} />
      <span className={s.fileMeta}>
        <span className={s.fileName}>{name}</span>
        <span className={s.fileSize}>{prettyBytes(size)}</span>
      </span>
    </a>
  );
};
