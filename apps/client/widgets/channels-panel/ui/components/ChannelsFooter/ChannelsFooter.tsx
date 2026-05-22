'use client';

import { useCurrentUser } from '@/entities/user';
import { Avatar, AvatarFallback, AvatarImage, UserName } from '@/shared/ui';
import { AppSettingsButton } from '@/widgets/app-settings';
import { channelsFooterStyles as s } from './ChannelsFooter.styles';

export const ChannelsFooter = () => {
  const { avatarUrl, displayName, initial, verified } = useCurrentUser();

  return (
    <div className={s.root}>
      <Avatar className={s.avatar}>
        {avatarUrl && <AvatarImage alt={displayName} src={avatarUrl} />}
        <AvatarFallback className={s.fallback}>{initial}</AvatarFallback>
      </Avatar>
      <div className={s.info}>
        <UserName className={s.name} name={displayName} verified={verified} />
        <span className={s.status}>online</span>
      </div>

      <AppSettingsButton />
    </div>
  );
};
