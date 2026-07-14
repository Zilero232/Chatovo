'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { appEvents } from '@/shared/lib';
import { IconButtonWithTooltip } from '@/shared/ui';
import s from './CheckUpdateButton.module.scss';

export const CheckUpdateButton = () => {
  const t = useTranslations('appSidebar');

  const [checking, setChecking] = useState(false);

  appEvents.on.updateCheckSettled(() => setChecking(false));

  const handleClick = () => {
    setChecking(true);
    appEvents.emit.recheckUpdate();
  };

  return (
    <IconButtonWithTooltip
      icon={<RefreshCw className={checking ? s.spinning : undefined} />}
      label={t('checkUpdateLabel')}
      tooltip={t('checkUpdate')}
      disabled={checking}
      onClick={handleClick}
    />
  );
};
