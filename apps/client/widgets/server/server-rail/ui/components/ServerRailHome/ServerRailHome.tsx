'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants';
import { BrandMark, Tooltip, TooltipContent } from '@/ui-kit';

import type { ServerRailHomeProps } from './ServerRailHome.types';

import s from '../ServerRailItem/ServerRailItem.module.scss';

export const ServerRailHome = ({ orientation, onNavigate }: ServerRailHomeProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('server.rail');

  const isActive = pathname !== ROUTES.server;

  return (
    <Tooltip>
      <button
        aria-current={isActive ? 'page' : undefined}
        aria-label={t('home')}
        className={clsx(s.root, s.home, { [s.active]: isActive })}
        type='button'
        onClick={() => {
          router.push(ROUTES.lobby);
          onNavigate?.();
        }}
      >
        <span aria-hidden className={s.pill} />
        <BrandMark size={26} />
      </button>
      <TooltipContent side={orientation === 'vertical' ? 'right' : 'top'}>
        {t('home')}
      </TooltipContent>
    </Tooltip>
  );
};
