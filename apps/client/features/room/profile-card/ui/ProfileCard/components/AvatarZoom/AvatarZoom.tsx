'use client';

import { useTranslations } from 'next-intl';

import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui';

import type { AvatarZoomProps } from './AvatarZoom.types';

import s from './AvatarZoom.module.scss';

export const AvatarZoom = ({ src, name, children }: AvatarZoomProps) => {
  const t = useTranslations('profileCard');

  if (!src) {
    return <>{children}</>;
  }

  return (
    <Dialog
      trigger={
        <Button aria-label={t('zoomAvatar')} className={s.trigger} type='button'>
          {children}
        </Button>
      }
    >
      <DialogContent className={s.content} showCloseButton={false}>
        <DialogTitle className='sr-only'>{t('avatarAlt', { name })}</DialogTitle>
        <DialogDescription className='sr-only'>{t('avatarZoomDescription')}</DialogDescription>
        <img alt={t('avatarAlt', { name })} className={s.image} src={src} />
      </DialogContent>
    </Dialog>
  );
};
