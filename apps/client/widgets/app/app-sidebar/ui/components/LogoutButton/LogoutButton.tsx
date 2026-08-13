'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { authClient, clearToken } from '@/shared/api';
import { IconButtonWithTooltip } from '@/shared/ui';

export const LogoutButton = () => {
  const t = useTranslations('appSidebar');
  const errorMessage = useErrorMessage();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    clearToken();

    if (error) {
      toast.error(errorMessage(error), { id: 'sign-out' });

      return;
    }

    toast.success(t('signedOut'), { id: 'sign-out' });
  };

  return <IconButtonWithTooltip icon={<LogOut />} label={t('logout')} onClick={handleLogout} />;
};
