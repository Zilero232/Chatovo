export {
  type ChangeEmailValues,
  type ChangePasswordValues,
  changeEmailSchema,
  changePasswordSchema,
  type ProfileValues,
  profileSchema,
  type UpdateProfileInput,
  useChangeEmail,
  useChangePassword,
  useCurrentUser,
  useSendVerificationEmail,
  useUpdateProfile,
} from './model/hooks';
export { UserAvatar } from './ui/UserAvatar';
export { UserName } from './ui/UserName';
export type { UserRole } from './model/types';
export type { UserAvatarProps } from './ui/UserAvatar';
export type { UserNameProps } from './ui/UserName';
