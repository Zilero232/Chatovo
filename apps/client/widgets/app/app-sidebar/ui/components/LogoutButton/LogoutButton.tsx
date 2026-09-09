'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { authClient, clearToken } from '@/shared/api';
import { IconButtonWithTooltip } from '@/ui-kit';

export const LogoutButton = () => {
  const t = useTranslations('appSidebar');
  const toastError = useToastError();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    clearToken();

    if (error) {
      toastError('sign-out')(error);

      return;
    }

    toast.success(t('signedOut'), { id: 'sign-out' });
  };

  return <IconButtonWithTooltip icon={<LogOut />} label={t('logout')} onClick={handleLogout} />;
};
