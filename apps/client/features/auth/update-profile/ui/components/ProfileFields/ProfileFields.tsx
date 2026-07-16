'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { useFieldError } from '@/entities/app/locale';
import { BannerColorField } from '../BannerColorField';
import { ProfileTextField } from '../ProfileTextField';

import type { ProfileFieldsProps } from './ProfileFields.types';

export const ProfileFields = ({ control, errors, register }: ProfileFieldsProps) => {
  const t = useTranslations('settings.profile');
  const fieldError = useFieldError('auth');

  return (
    <>
      <ProfileTextField
        id="profile-display-name"
        label={t('displayNameLabel')}
        hint={t('displayNameHint')}
        error={errors.displayName && fieldError(errors.displayName)}
        registration={register('displayName')}
        autoComplete="name"
      />

      <ProfileTextField
        id="profile-url"
        label={t('profileUrlLabel')}
        hint={t('profileUrlHint')}
        error={errors.profileUrl && fieldError(errors.profileUrl)}
        registration={register('profileUrl')}
        autoComplete="url"
        placeholder={t('profileUrlPlaceholder')}
        type="url"
      />

      <ProfileTextField
        id="profile-bio"
        label={t('bioLabel')}
        hint={t('bioHint')}
        error={errors.bio && fieldError(errors.bio)}
        registration={register('bio')}
        placeholder={t('bioPlaceholder')}
        rows={3}
        multiline
      />

      <Controller
        control={control}
        name="bannerColor"
        render={({ field }) => <BannerColorField value={field.value} onChange={field.onChange} />}
      />
    </>
  );
};
