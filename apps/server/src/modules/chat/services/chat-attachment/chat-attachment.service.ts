import type { ChatAttachment } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { extension } from 'mime-types';

import type { UploadAttachmentInput } from './chat-attachment.service.types';

import { AppBadRequestException } from '../../../../common/exceptions';
import { ATTACHMENT_MAX_BYTES } from '../../../../config/uploads';
import { assertCanAccessDmRoom, assertRoomExists } from '../../../../lib';
import { saveUpload } from '../../../uploads';

@Injectable()
export class ChatAttachmentService {
  async uploadAttachment({ roomId, file, userId }: UploadAttachmentInput): Promise<ChatAttachment> {
    const { size, mimetype: type, originalname: name } = file;

    if (size === 0) {
      throw new AppBadRequestException('FILE_EMPTY', 'Empty file');
    }

    if (size > ATTACHMENT_MAX_BYTES) {
      throw new AppBadRequestException('FILE_TOO_LARGE', 'File too large');
    }

    await assertRoomExists(roomId);
    await assertCanAccessDmRoom({ roomId, userId });

    const ext = extension(type) || 'bin';
    const key = `chat-attachments/${roomId}/${crypto.randomUUID()}.${ext}`;
    const buffer = new ArrayBuffer(file.buffer.byteLength);

    new Uint8Array(buffer).set(file.buffer);

    const url = await saveUpload(key, buffer);

    return { kind: 'attachment', url, name, size, mime: type };
  }
}
