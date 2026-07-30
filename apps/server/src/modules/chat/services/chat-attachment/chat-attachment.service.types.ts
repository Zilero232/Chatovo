import type { UploadedAttachment } from '../../chat.types';

export type UploadAttachmentInput = {
  roomId: string;
  file: UploadedAttachment;
  userId: string;
};
