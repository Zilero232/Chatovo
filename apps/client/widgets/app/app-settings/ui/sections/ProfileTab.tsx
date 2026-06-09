'use client';

import { UpdateProfileForm } from '@/features/auth/update-profile';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

export const ProfileTab = () => {
  return (
    <div className={s.profilePanel}>
      <UpdateProfileForm />
    </div>
  );
};
