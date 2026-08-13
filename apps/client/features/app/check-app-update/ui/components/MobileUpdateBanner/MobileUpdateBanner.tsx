'use client';

import { ArrowDownToLine } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { SITE } from '@/shared/config';
import { openExternal } from '@/shared/lib';
import { Banner, Button } from '@/shared/ui';

import { useMobileUpdate } from '../../../model/use-mobile-update';
import {
  MOBILE_UPDATE_BANNER_ANIMATE,
  MOBILE_UPDATE_BANNER_EXIT,
  MOBILE_UPDATE_BANNER_INITIAL,
  MOBILE_UPDATE_BANNER_TRANSITION
} from './MobileUpdateBanner.motion';

export const MobileUpdateBanner = () => {
  const t = useTranslations('update');
  const update = useMobileUpdate();

  const downloadUrl = update.hasUpdate ? (update.downloadUrl ?? SITE.url) : SITE.url;

  return (
    <AnimatePresence initial={false}>
      {update.hasUpdate && (
        <motion.div
          animate={MOBILE_UPDATE_BANNER_ANIMATE}
          exit={MOBILE_UPDATE_BANNER_EXIT}
          initial={MOBILE_UPDATE_BANNER_INITIAL}
          transition={MOBILE_UPDATE_BANNER_TRANSITION}
        >
          <Banner
            action={
              <Button size='sm' type='button' onClick={() => openExternal(downloadUrl)}>
                {t('mobileAction')}
              </Button>
            }
            description={t('mobileBody')}
            icon={<ArrowDownToLine />}
            title={t('mobileTitle', { version: update.version })}
            tone='accent'
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
