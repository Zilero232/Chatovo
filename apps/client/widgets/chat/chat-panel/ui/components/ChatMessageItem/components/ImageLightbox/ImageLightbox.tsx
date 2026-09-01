'use client';

import { Download, ExternalLink, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import prettyBytes from 'pretty-bytes';

import { openExternal } from '@/shared/lib';
import { Button, Dialog, DialogContent, DialogTitle } from '@/ui-kit';

import type { ImageLightboxProps } from './ImageLightbox.types';

import s from './ImageLightbox.module.scss';

export const ImageLightbox = ({ src, name, size, open, onOpenChange }: ImageLightboxProps) => {
  const t = useTranslations('chat');
  const tCommon = useTranslations('common');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content} showCloseButton={false}>
        <header className={s.bar}>
          <div className={s.meta}>
            <DialogTitle className={s.name}>{name}</DialogTitle>
            <span className={s.size}>{prettyBytes(size)}</span>
          </div>

          <Button
            aria-label={tCommon('close')}
            size='icon-sm'
            variant='ghost'
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden />
          </Button>
        </header>

        <figure className={s.figure}>
          <img alt={name} className={s.image} src={src} />
        </figure>

        <footer className={s.footer}>
          <Button size='sm' variant='ghost' onClick={() => openExternal(src)}>
            <ExternalLink aria-hidden />
            {t('openInBrowser')}
          </Button>

          <Button download={name} href={src} size='sm' variant='secondary'>
            <Download aria-hidden />
            {t('download')}
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
};
