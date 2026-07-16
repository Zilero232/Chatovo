'use client';

import { UserAvatar, UserName, useCurrentUser } from '@/entities/auth/user';
import { FriendTag } from '@/entities/social/friend';
import { FriendProfileActions } from '@/features/social/friend-profile-actions';
import { Text } from '@/shared/ui';
import { getBannerStyle } from '../../lib/banner-style';
import { useUserProfile } from '../../model/use-user-profile';
import { AvatarZoom, ProfileCardSkeleton, ProfileVoiceBlock } from './components';

import s from './ProfileCard.module.scss';

import type { ProfileCardProps } from './ProfileCard.types';

export const ProfileCard = ({ identity, name }: ProfileCardProps) => {
  const { user } = useCurrentUser();

  const { data: profile, isLoading } = useUserProfile(identity);

  const isSelf = user?.id === identity;

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  const displayName = profile?.name ?? name;

  return (
    <div className={s.root}>
      <div className={s.banner} style={getBannerStyle(profile?.bannerColor)} />

      <div className={s.body}>
        <div className={s.avatarWrap}>
          <AvatarZoom name={displayName} src={profile?.avatarUrl ?? null}>
            <UserAvatar
              className={s.avatar}
              colorize
              name={displayName}
              size="lg"
              src={profile?.avatarUrl}
            />
          </AvatarZoom>
        </div>

        <div className={s.identity}>
          <UserName
            className={s.name}
            name={displayName}
            profileUrl={profile?.profileUrl}
            size="md"
            verified={profile?.verified ?? false}
          />
          {profile?.friendTag && <FriendTag className={s.tag} tag={profile.friendTag} />}
        </div>

        {profile?.bio && (
          <Text className={s.bio} size="sm" tone="muted">
            {profile.bio}
          </Text>
        )}

        <ProfileVoiceBlock identity={identity} isSelf={isSelf} isLoading={false} />

        {!isSelf && profile?.friendTag && (
          <FriendProfileActions
            avatarUrl={profile?.avatarUrl ?? null}
            displayName={displayName}
            friendTag={profile.friendTag}
            userId={identity}
            verified={profile?.verified ?? false}
          />
        )}
      </div>
    </div>
  );
};
