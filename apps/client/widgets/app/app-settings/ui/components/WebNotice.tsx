'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DownloadAppDialog } from '@/features/app/download-app';
import s from '../AppSettingsButton.module.scss';

export const WebNotice = () => {
  const t = useTranslations('settings.shortcuts');
  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <>
      <div className={s.webNotice}>
        <Info className={s.webNoticeIcon} />
        <p className={s.webNoticeText}>
          {t.rich('webNotice', {
            link: (chunks) => (
              <button className={s.webNoticeLink} onClick={() => toggleOpen(true)} type="button">
                {chunks}
              </button>
            ),
          })}
        </p>
      </div>

      <DownloadAppDialog open={isOpen} onOpenChange={toggleOpen} />
    </>
  );
};
