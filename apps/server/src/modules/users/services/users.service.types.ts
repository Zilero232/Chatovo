import type { UpdateProfileInput, UploadedAvatar } from '../users.types';

export type UploadAvatarInput = {
  userId: string;
  file: UploadedAvatar;
};

export type ResolveAvatarUrlInput = {
  userId: string;
  avatar: UploadedAvatar | undefined;
  removeAvatar: string | undefined;
};

export type UpdateUserProfileInput = {
  userId: string;
  input: UpdateProfileInput;
};
