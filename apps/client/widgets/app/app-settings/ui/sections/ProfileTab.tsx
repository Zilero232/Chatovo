'use client';

import { UpdateProfileForm } from '@/features/auth/update-profile';

import s from '../AppSettingsButton.module.scss';

export const ProfileTab = () => {
  return (
    <div className={s.profilePanel}>
      <UpdateProfileForm />
    </div>
  );
};
