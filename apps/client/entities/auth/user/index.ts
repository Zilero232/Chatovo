export {
  changeEmailSchema,
  type ChangeEmailValues,
  changePasswordSchema,
  type ChangePasswordValues,
  profileSchema,
  type ProfileValues,
  type UpdateProfileInput,
  useChangeEmail,
  useChangePassword,
  useCurrentUser,
  useSendVerificationEmail,
  useUpdateProfile
} from './model/hooks';
export type { UserRole } from './model/types';
export { UserAvatar } from './ui/UserAvatar';

export type { UserAvatarProps } from './ui/UserAvatar';
export { UserName } from './ui/UserName';
export type { UserNameProps } from './ui/UserName';
