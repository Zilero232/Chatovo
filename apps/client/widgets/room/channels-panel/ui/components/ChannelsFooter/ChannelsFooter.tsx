'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { ReportProblemButton } from '@/features/app/report-problem';
import { authClient, clearToken } from '@/shared/api';
import { IconButtonWithTooltip } from '@/ui-kit';
import { AppSettingsButton } from '@/widgets/app/app-settings';

import s from './ChannelsFooter.module.scss';

export const ChannelsFooter = () => {
  const t = useTranslations('channels');
  const tSidebar = useTranslations('appSidebar');
  const toastError = useToastError();

  const { avatarUrl, developer, displayName, friendTag, verified } = useCurrentUser();

  const logout = async () => {
    const { error } = await authClient.signOut();

    clearToken();

    if (error) {
      toastError('sign-out')(error);

      return;
    }

    toast.success(tSidebar('signedOut'), { id: 'sign-out' });
  };

  return (
    <div className={s.root}>
      <span className={s.avatarSlot}>
        <UserAvatar
          className={s.avatar}
          fallbackClassName={s.fallback}
          name={displayName}
          src={avatarUrl}
        />
        <span aria-hidden className={s.presenceDot} />
      </span>

      <div className={s.info}>
        <UserName className={s.name} developer={developer} name={displayName} verified={verified} />
        <span className={s.tag}>{friendTag ?? t('online')}</span>
      </div>

      <div className={s.actions}>
        <ReportProblemButton />
        <AppSettingsButton />
        <IconButtonWithTooltip
          icon={<LogOut />}
          label={tSidebar('logout')}
          size='icon-sm'
          tooltipSide='top'
          onClick={logout}
        />
      </div>
    </div>
  );
};
