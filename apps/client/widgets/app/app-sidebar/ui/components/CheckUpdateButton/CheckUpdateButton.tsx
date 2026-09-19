'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButtonWithTooltip } from '@/ui-kit';

import { useUpdateCheckState } from '../../../model/hooks';

import s from './CheckUpdateButton.module.scss';

export const CheckUpdateButton = () => {
  const t = useTranslations('appSidebar');

  const { isChecking, requestCheck } = useUpdateCheckState();

  return (
    <IconButtonWithTooltip
      disabled={isChecking}
      icon={<RefreshCw className={isChecking ? s.spinning : undefined} />}
      label={t('checkUpdateLabel')}
      tooltip={t('checkUpdate')}
      onClick={requestCheck}
    />
  );
};
