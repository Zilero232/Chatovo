export type UploadedAvatar = {
  buffer: Buffer;
  mimetype: string;
  size: number;
};

export type UpdateProfileInput = {
  avatar?: UploadedAvatar;
  bannerColor: string;
  bio: string;
  displayName: string;
  profileUrl: string;
  removeAvatar?: string;
};
