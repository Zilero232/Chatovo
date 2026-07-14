'use client';

import { useTranslations } from 'next-intl';

import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui';

import s from './AvatarZoom.module.scss';

import type { AvatarZoomProps } from './AvatarZoom.types';

export const AvatarZoom = ({ src, name, children }: AvatarZoomProps) => {
  const t = useTranslations('profileCard');

  if (!src) {
    return <>{children}</>;
  }

  return (
    <Dialog
      trigger={
        <Button className={s.trigger} type="button">
          {children}
        </Button>
      }
    >
      <DialogContent className={s.content} showCloseButton={false}>
        <DialogTitle className="sr-only">{t('avatarAlt', { name })}</DialogTitle>
        <DialogDescription className="sr-only">{t('avatarZoomDescription')}</DialogDescription>
        {/* biome-ignore lint/performance/noImgElement: static export (images.unoptimized) — next/image adds no value for a one-off lightbox of a remote URL */}
        <img alt={t('avatarAlt', { name })} className={s.image} src={src} />
      </DialogContent>
    </Dialog>
  );
};
