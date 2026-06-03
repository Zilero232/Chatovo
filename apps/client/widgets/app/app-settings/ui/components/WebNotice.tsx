'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DownloadAppDialog } from '@/features/app/download-app';

export const WebNotice = () => {
  const t = useTranslations('settings.shortcuts');
  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <>
      <div className="flex items-start gap-3 rounded-lg border border-brand-cyan/40 bg-brand-cyan/10 p-4 text-sm backdrop-blur-md">
        <Info className="mt-0.5 size-4 shrink-0 text-brand-cyan" />
        <p className="leading-relaxed">
          {t.rich('webNotice', {
            link: (chunks) => (
              <button
                className="font-medium text-brand-cyan underline-offset-2 hover:underline"
                onClick={() => toggleOpen(true)}
                type="button"
              >
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
