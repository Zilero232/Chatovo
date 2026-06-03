'use client';

import { type ProfileValues, profileSchema, type UpdateProfileInput } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';
import { queryClient, updateUserProfile } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export type { ProfileValues, UpdateProfileInput };
export { profileSchema };

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async ({
      displayName,
      profileUrl,
      bannerColor,
      bio,
      avatar,
    }: UpdateProfileInput) => {
      const profile = await updateUserProfile({
        displayName,
        profileUrl,
        bannerColor,
        bio,
        avatar,
      });

      queryClient.setQueryData(QUERY_KEYS.userProfile(profile.id), profile);

      return profile;
    },
  });
};
