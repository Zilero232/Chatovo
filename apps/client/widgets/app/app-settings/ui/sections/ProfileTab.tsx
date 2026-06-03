'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/app/locale';
import {
  type ProfileValues,
  profileSchema,
  useCurrentUser,
  useUpdateProfile,
} from '@/entities/auth/user';
import { Button } from '@/shared/ui';
import { useAvatarDraft } from '../../model/hooks';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { ProfileTextField } from '../components/ProfileTextField';
import { AvatarField } from '../fields/AvatarField';
import { BannerColorField } from '../fields/BannerColorField';

export const ProfileTab = () => {
  const t = useTranslations('settings.profile');
  const fieldError = useFieldError('auth');

  const { displayName, profileUrl, avatarUrl, bannerColor, bio } = useCurrentUser();

  const { isPending, mutate } = useUpdateProfile();

  const avatar = useAvatarDraft(avatarUrl);

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName,
      profileUrl: profileUrl ?? '',
      bannerColor,
      bio: bio ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      { ...values, avatar: avatar.value },
      {
        onSuccess: () => {
          toast.success(t('saved'));
          reset(values);
          avatar.reset();
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  });

  const canSave = (isDirty || avatar.changed) && !isPending;

  return (
    <div className={s.profilePanel}>
      <form className={s.profileForm} onSubmit={onSubmit}>
        <AvatarField
          name={displayName}
          src={avatar.shownSrc}
          onPick={avatar.pick}
          onRemove={avatar.remove}
        />

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

        <Button className={s.profileSubmit} disabled={!canSave} type="submit">
          {isPending && <Loader2 className={s.profileSpinner} />}
          {t('save')}
        </Button>
      </form>
    </div>
  );
};
