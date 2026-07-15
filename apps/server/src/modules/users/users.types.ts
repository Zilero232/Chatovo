export type UploadedAvatar = {
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type UpdateProfileInput = {
  displayName: string;
  profileUrl: string;
  bannerColor: string;
  bio: string;
  avatar?: UploadedAvatar;
  removeAvatar?: string;
};
