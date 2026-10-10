import type { ChatAttachment } from '@chatovo/schemas';

import { ATTACHMENT_MAX_BYTES } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { extension } from 'mime-types';
import { pick } from 'remeda';

import type { UploadAttachmentInput } from './chat-attachment.service.types';

import { AppBadRequestException } from '../../../../common/exceptions';
import { assertCanAccessRoom, decodeUploadName, processChatImage } from '../../../../lib';
import { saveUpload, toArrayBuffer } from '../../../uploads';

@Injectable()
export class ChatAttachmentService {
  async uploadAttachment({ roomId, file, userId }: UploadAttachmentInput): Promise<ChatAttachment> {
    const { buffer, size, mimetype: mime } = file;
    const name = decodeUploadName(file.originalname);

    if (size === 0) {
      throw new AppBadRequestException('FILE_EMPTY', 'Empty file');
    }

    if (size > ATTACHMENT_MAX_BYTES) {
      throw new AppBadRequestException('FILE_TOO_LARGE', 'File too large');
    }

    await assertCanAccessRoom({ roomId, userId });

    const image = await processChatImage({ buffer, mime });
    const stored = image?.original ?? { buffer, mime };
    const key = `chat-attachments/${roomId}/${crypto.randomUUID()}.${extension(mime) || 'bin'}`;
    const url = await saveUpload(key, toArrayBuffer(stored.buffer));

    return {
      kind: 'attachment',
      url,
      name,
      size: stored.buffer.byteLength,
      mime,
      image: image ? pick(image, ['width', 'height', 'placeholder']) : undefined
    };
  }
}
