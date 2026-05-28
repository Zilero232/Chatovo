'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { appBus } from '@/shared/lib';
import { IconButtonWithTooltip } from '@/shared/ui';

export const CheckUpdateButton = () => {
  const t = useTranslations('appSidebar');

  return (
    <IconButtonWithTooltip
      icon={<RefreshCw />}
      label={t('checkUpdateLabel')}
      tooltip={t('checkUpdate')}
      onClick={() => appBus.push('recheckUpdate', undefined)}
    />
  );
};
