'use client';

import { ArrowLeft, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { useCurrentUser } from '@/entities/auth/user';
import { ROUTES } from '@/shared/constants';
import { IconButtonWithTooltip } from '@/ui-kit';

export const AdminButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('admin');
  const { isAdmin } = useCurrentUser();

  if (!isAdmin) {
    return null;
  }

  const isInAdmin = pathname.startsWith(ROUTES.admin);
  const label = isInAdmin ? t('backToLobby') : t('title');

  return (
    <IconButtonWithTooltip
      icon={isInAdmin ? <ArrowLeft /> : <Wrench />}
      label={label}
      onClick={() => router.push(isInAdmin ? ROUTES.lobby : ROUTES.admin)}
    />
  );
};
