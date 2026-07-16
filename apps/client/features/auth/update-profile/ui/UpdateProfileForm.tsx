'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import {
  type ProfileValues,
  profileSchema,
  useCurrentUser,
  useUpdateProfile,
} from '@/entities/auth/user';
import { SubmitButton } from '@/shared/ui';
import { useAvatarDraft } from '../model/use-avatar-draft';
import { AvatarField, ProfileFields } from './components';

import s from './UpdateProfileForm.module.scss';

export const UpdateProfileForm = () => {
  const t = useTranslations('settings.profile');
  const errorMessage = useErrorMessage();

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
        onError: (err: Error) => toast.error(errorMessage(err)),
      },
    );
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <AvatarField
        name={displayName}
        src={avatar.shownSrc}
        onPick={avatar.pick}
        onRemove={avatar.remove}
      />

      <ProfileFields control={control} errors={errors} register={register} />

      <SubmitButton
        className={s.submit}
        disabled={!(isDirty || avatar.changed)}
        isPending={isPending}
      >
        {t('save')}
      </SubmitButton>
    </form>
  );
};
