'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { supabase } from '@/shared/api';
import { IconButtonWithTooltip } from '@/shared/ui';

export const LogoutButton = () => {
  const t = useTranslations('appSidebar');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);

      return;
    }

    toast.success(t('signedOut'));
  };

  return <IconButtonWithTooltip icon={<LogOut />} label={t('logout')} onClick={handleLogout} />;
};
